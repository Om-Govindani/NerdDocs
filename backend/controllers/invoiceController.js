import UserCourses from "../models/UserCourses.js";
import Order from "../models/Order.js";
import CourseMeta from "../models/CourseMeta.js";
import User from "../models/User.js";
import { decryptEmail } from "../utils/emailCrypto.js";
import { generateInvoicePDF } from "../utils/generateInvoicePDF.js";
import { sendInvoiceEmail } from "../utils/sendInvoiceEmail.js";

export async function sendInvoice(req, res) {
  try {
    const userId = req.user.userId; // ✅ FIX
    const { courseId } = req.params;

    // 1️⃣ Ownership check
    const owns = await UserCourses.findOne({
      user_id: userId, // ✅ FIX
      course_id: courseId,
    });
    if (!owns) {
      return res.status(403).json({
        success: false,
        message: "Course not purchased",
      });
    }
    // 2️⃣ Latest PAID order
    const order = await Order.findOne({
      user_id: userId, // ✅ FIX
      course_id: courseId,
      status: "PAID",
    }).sort({ createdAt: -1 });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 3️⃣ Course meta
    const course = await CourseMeta.findOne({
      course_id: courseId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 4️⃣ Fetch USER to get encrypted email
    const user = await User.findById(userId);
    console.log(user);
    if (!user || !user.emailEncrypted) {
      throw new Error("User email not found");
    }

    const toEmail = decryptEmail(user.emailEncrypted);

    // 5️⃣ Generate invoice PDF
    const pdfBuffer = await generateInvoicePDF({
      invoiceNo: `ND-${order._id}`,
      toEmail,
      course,
      order,
    });

    // 6️⃣ Send mail
    await sendInvoiceEmail({
      to: toEmail,
      pdfBuffer,
      course,
      order,
    });

    return res.json({
      success: true,
      message: "Invoice sent to registered email",
    });
  } catch (err) {
    console.error("Send invoice failed:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send invoice",
    });
  }
}

export async function getInvoiceData(req, res) {
  try {
    const userId = req.user.userId; // ✅ FIXED
    const { courseId } = req.params;
    // 1️⃣ Ownership check
    const owns = await UserCourses.findOne({
      user_id: userId,
      course_id: courseId,
    });

    if (!owns) {
      return res.status(403).json({
        success: false,
        message: "Course not purchased",
      });
    }

    // 2️⃣ Latest PAID order
    const order = await Order.findOne({
      user_id: userId,
      course_id: courseId,
      status: "PAID",
    }).sort({ createdAt: -1 });

    console.log(order)

    

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 3️⃣ Course meta
    const course = await CourseMeta.findOne({
      course_id: courseId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 4️⃣ User email
    const user = await User.findById(userId);

    if (!user || !user.emailEncrypted) {
      throw new Error("User email not found");
    }

    const email = decryptEmail(user.emailEncrypted);
    
    // 5️⃣ Respond with PURE DATA
    return res.json({
      success: true,
      invoiceNo: `ND-${order._id}`,
      email,
      course: {
        title: course.title,
      },
      order: {
        razorpay_payment_id: order.razorpay_payment_id,
        amount: order.amount,
        
      },
    });
  } catch (err) {
    console.error("Get invoice data failed:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch invoice data",
    });
  }
}
