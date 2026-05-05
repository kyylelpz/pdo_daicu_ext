import { Router } from "express";
import ContactMessage from "../models/ContactMessage";

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
    });

    return res.status(201).json({
      success: true,
      message: "Contact message saved successfully.",
      data: contactMessage,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while saving contact message.",
    });
  }
});

export default router;