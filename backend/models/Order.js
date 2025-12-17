// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String },
  razorpay_signature: { type: String },

  user_id: { type: String, required: true },
  course_id: { type: String, required: true },

  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  status: {
    type: String,
    enum: ["CREATED", "PAID", "FAILED"],
    default: "CREATED",
  },
}, { timestamps: true });


export default mongoose.model("Order", OrderSchema);
