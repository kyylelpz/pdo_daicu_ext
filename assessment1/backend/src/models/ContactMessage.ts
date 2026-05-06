import mongoose, { Schema } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    failureReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model("ContactMessage", ContactMessageSchema);

export default ContactMessage;
