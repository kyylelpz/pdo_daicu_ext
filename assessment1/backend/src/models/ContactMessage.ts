import mongoose, { Schema } from "mongoose";

export interface IContactMessage extends Document {
  name: string;
  email: string;
  message: string;
  status: "pending" | "sent" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
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
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContactMessage>(
  "ContactMessage",
  ContactMessageSchema
);