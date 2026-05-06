import { Router } from "express";
import ContactMessage from "../models/ContactMessage";
import { sendEmail } from "../services/mail.service";
import EmailTemplate from "../models/EmailTemplate";
import { renderTemplate } from "../utils/template.util";
import { contactRateLimiter } from "../middleware/rateLimit.middleware";
import {
  isValidEmail,
  validateContactInput,
} from "../utils/contactValidation.util";
import {
  formatSubmittedAt,
  generateReferenceNumber,
} from "../utils/contactMetadata.util";

const router = Router();
const MAX_REFERENCE_NUMBER_ATTEMPTS = 3;

type CreateContactMessageInput = {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
};

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: number }).code === 11000;

const createContactMessageWithReference = async ({
  name,
  email,
  message,
  submittedAt,
}: CreateContactMessageInput) => {
  for (let attempt = 1; attempt <= MAX_REFERENCE_NUMBER_ATTEMPTS; attempt += 1) {
    const referenceNumber = generateReferenceNumber(submittedAt);

    try {
      const contactMessage = await ContactMessage.create({
        name,
        email,
        message,
        referenceNumber,
        submittedAt,
        status: "pending",
      });

      return {
        contactMessage,
        referenceNumber,
      };
    } catch (error) {
      const canRetry =
        isDuplicateKeyError(error) && attempt < MAX_REFERENCE_NUMBER_ATTEMPTS;

      if (!canRetry) {
        throw error;
      }
    }
  }

  throw new Error("Unable to generate a unique reference number.");
};

router.post("/", contactRateLimiter(), async (req, res) => {
  let contactMessageId: string | undefined;

  try {
    const validation = validateContactInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Please correct the highlighted fields.",
        errors: validation.errors,
      });
    }

    const { name, email, message } = validation.data;
    const mailTo = process.env.MAIL_TO?.trim();
    const mailRecipients = mailTo
      ?.split(",")
      .map((recipient) => recipient.trim())
      .filter(Boolean);
    const submittedAt = new Date();
    const submittedAtLabel = formatSubmittedAt(submittedAt);

    if (
      !mailRecipients?.length ||
      mailRecipients.some((recipient) => !isValidEmail(recipient))
    ) {
      throw new Error("MAIL_TO is missing or invalid in .env");
    }

    const { contactMessage, referenceNumber } =
      await createContactMessageWithReference({
      name,
      email,
      message,
      submittedAt,
    });
    contactMessageId = contactMessage._id.toString();

    const template = await EmailTemplate.findOne({ isActive: true });

    if (!template) {
      throw new Error("No active email template found.");
    }

    const html = renderTemplate(template.html, {
      name,
      email,
      message,
      referenceNumber,
      submittedAt: submittedAtLabel,
    });
    const subject = renderTemplate(template.subject, {
      name,
      email,
      message,
      referenceNumber,
      submittedAt: submittedAtLabel,
    });

    await sendEmail(mailRecipients.join(","), subject, html);

    await ContactMessage.findByIdAndUpdate(contactMessage._id, {
      status: "sent",
      failureReason: null,
    });

    const updatedMessage = await ContactMessage.findById(contactMessage._id);

    return res.status(201).json({
      success: true,
      message: "Contact message saved and email sent successfully.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    if (contactMessageId) {
      await ContactMessage.findByIdAndUpdate(contactMessageId, {
        status: "failed",
        failureReason: error instanceof Error ? error.message : "Unknown error",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while saving contact message or sending email.",
    });
  }
});

router.get("/template-test", async (_req, res) => {
  const template = await EmailTemplate.findOne({ isActive: true });

  if (!template) {
    return res.status(404).json({
      success: false,
      message: "No active email template found.",
    });
  }

  const submittedAt = new Date();
  const templateData = {
    name: "Kyle",
    email: "kyle@example.com",
    message: "Hello from template test",
    referenceNumber: generateReferenceNumber(submittedAt),
    submittedAt: formatSubmittedAt(submittedAt),
  };
  const htmlPreview = renderTemplate(template.html, templateData);
  const subjectPreview = renderTemplate(template.subject, templateData);

  return res.json({
    success: true,
    subject: subjectPreview,
    htmlPreview,
  });
});

export default router;
