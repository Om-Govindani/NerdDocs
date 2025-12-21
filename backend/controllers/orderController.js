// controllers/orderController.js
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

import CourseMeta from "../models/CourseMeta.js";
import Order from "../models/Order.js";
import UserCourses from "../models/UserCourses.js";
import User from "../models/User.js";
import { decryptEmail } from "../utils/emailCrypto.js";



import { generateInvoiceHTML } from "../utils/invoiceTemplate.js";
import { generateInvoicePDF } from "../utils/generatePdf.js";
import { sendInvoiceEmail } from "../utils/sendInvoiceEmail.js";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ===============================
// CREATE ORDER
// ===============================
export const createOrder = async (req, res) => {
  try {
    const userId = String(req.user.userId);
    const { course_id } = req.body;

    if (!course_id)
      return res.status(400).json({ error: "course_id required" });

    // Check if already purchased
    const alreadyBought = await UserCourses.findOne({
      user_id: userId,
      course_id,
    });

    if (alreadyBought)
      return res.status(400).json({ error: "Course already purchased" });

    const course = await CourseMeta.findOne({ course_id });
    if (!course) return res.status(404).json({ error: "Course not found" });

    const amount = (course.afterDiscountPrice ?? course.price) * 100; // paise

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${course_id}_${Date.now()}`,
    });
    console.log(razorpayOrder);

    // Save order in DB
    const order = await Order.create({
      user_id: userId,
      course_id,
      razorpay_order_id: razorpayOrder.id,
      amount,
      status: "CREATED",
    });
    console.log("_____");
    console.log(order);
    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount,
      courseTitle: course.title,
      thumbnailUrl: course.thumbnailUrl,
    });
    console.log(res);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

// ===============================
// VERIFY PAYMENT
// ===============================
export const verifyPayment = async (req, res) => {
  try {
    const userId = String(req.user.userId);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment payload" });
    }

    const order = await Order.findOne({ razorpay_order_id });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // -------------------------------
    // 1️⃣ VERIFY SIGNATURE
    // -------------------------------
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      order.status = "FAILED";
      await order.save();
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // -------------------------------
    // 2️⃣ MARK ORDER PAID (IDEMPOTENT)
    // -------------------------------
    if (order.status !== "PAID") {
      order.status = "PAID";
      order.razorpay_payment_id = razorpay_payment_id;
      await order.save();
    }

    // -------------------------------
    // 3️⃣ GRANT COURSE ACCESS (SAFE)
    // -------------------------------
    const alreadyGranted = await UserCourses.findOne({
      user_id: userId,
      course_id: order.course_id,
    });

    if (!alreadyGranted) {
      await UserCourses.create({
        user_id: userId,
        course_id: order.course_id,
        completed: false,
      });
    }

    // -------------------------------
    // 4️⃣ SEND INVOICE (ASYNC / FIRE-AND-FORGET)
    // -------------------------------

    // ⛔ DO NOT await this block
    setImmediate(async () => {
      try {
        const user = await User.findById(userId);
        const course = await CourseMeta.findOne({
          course_id: order.course_id,
        });

        if (!user || !course) return;

        const toEmail = decryptEmail(user.emailEncrypted);
        if (!toEmail) {
          throw new Error("Decrypted email missing");
        }

        const invoiceHTML = generateInvoiceHTML({
          invoiceNo: `ND-${Date.now()}`,
          toEmail,
          course,
          order,
        });

        const pdfBuffer = await generateInvoicePDF(invoiceHTML);

        await sendInvoiceEmail({
          to: toEmail,
          pdfBuffer,
          course,
          order,
        });

        console.log("Invoice email sent successfully");
      } catch (err) {
        console.error("Async invoice/email failed:", err);
      }
    });

    // -------------------------------
    // 5️⃣ FINAL RESPONSE (FAST)
    // -------------------------------
    return res.json({
      success: true,
      message: "Payment verified, course unlocked",
    });


  } catch (err) {
    console.error("Verify payment error:", err);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};