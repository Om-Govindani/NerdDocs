// models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },       // Razorpay order_id
    paymentId: { type: String },                     // Razorpay payment_id
    signature: { type: String },

    user_id: { type: String, required: true },
    course_id: { type: String, required: true },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    meta: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
