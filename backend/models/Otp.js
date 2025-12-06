import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email     : { type: String, required: true },
    otpHash   : { type: String, required: true },
    purpose   : { type: String, enum: ["login", "signup"], required: true },
    expiresAt : { type: Date, required: true },
    used      : { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
