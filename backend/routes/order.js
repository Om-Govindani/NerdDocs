// routes/order.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  createOrder,
  verifyPayment
} from "../controllers/orderController.js";

const router = express.Router();

// Create Razorpay Order
router.post("/create", auth, createOrder);

// Verify Razorpay Payment
router.post("/verify", auth, verifyPayment);

export default router;
