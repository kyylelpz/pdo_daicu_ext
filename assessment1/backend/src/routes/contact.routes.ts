import { Router } from "express";
import ContactMessage from "../models/ContactMessage";
import { sendEmail } from "../services/mail.service";
import EmailTemplate from "../models/EmailTemplate";
import { renderTemplate } from "../utils/template.util";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      message,
      status: "pending",
    });

    const template = await EmailTemplate.findOne({ isActive: true });

    if (!template) {
      throw new Error("No active email template found.");
    }

    const html = renderTemplate(template.html, {
      name,
      email,
      message,
    });

    await sendEmail(process.env.MAIL_TO!, template.subject, html);

    await ContactMessage.findByIdAndUpdate(contactMessage._id, {
      status: "sent",
    });

    const updatedMessage = await ContactMessage.findById(contactMessage._id);

    return res.status(201).json({
      success: true,
      message: "Contact message saved and email sent successfully.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while saving contact message or sending email.",
      error: error instanceof Error ? error.message : error,
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