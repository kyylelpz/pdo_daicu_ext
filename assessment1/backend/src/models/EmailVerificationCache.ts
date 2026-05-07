import mongoose, { Schema } from "mongoose";

const EmailVerificationCacheSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    isValid: {
      type: Boolean,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    checkedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const EmailVerificationCache = mongoose.model(
  "EmailVerificationCache",
  EmailVerificationCacheSchema
);

export default EmailVerificationCache;
