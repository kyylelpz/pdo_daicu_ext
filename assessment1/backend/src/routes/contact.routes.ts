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

const router = Router();

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

    if (!mailTo || !isValidEmail(mailTo)) {
      throw new Error("MAIL_TO is missing or invalid in .env");
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      message,
      status: "pending",
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
    });

    await sendEmail(mailTo, template.subject, html);

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

  const htmlPreview = renderTemplate(template.html, {
    name: "Kyle",
    email: "kyle@example.com",
    message: "Hello from template test",
  });

  return res.json({
    success: true,
    subject: template.subject,
    htmlPreview,
  });
});

export default router;
