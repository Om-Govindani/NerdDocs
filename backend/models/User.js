// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    user_id: { type: String, unique: true, required: true }, 
    fullName: { type: String },
    emailEncrypted: { type: String, required: true },
    emailHash: { type: String, required: true, index: true },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
