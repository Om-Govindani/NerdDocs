import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// 🔁 SAME transporter as emailSender.js
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendInvoiceEmail({
  to,
  pdfBuffer,
  course,
  order,
}) {
  await transporter.sendMail({
    from: `"NerdDocs" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Invoice for ${course.title}`,

    html: `
      <div style="font-family: Arial; font-size: 15px; line-height: 1.6;">
        <p>Hi,</p>

        <p>
          Thank you for purchasing
          <strong>${course.title}</strong> on NerdDocs.
        </p>

        <p><strong>Payment Details:</strong></p>
        <ul>
          <li>Amount Paid: ₹${order.amount / 100}</li>
          <li>Transaction ID: ${order.razorpay_payment_id}</li>
          <li>Order ID: ${order.razorpay_order_id}</li>
        </ul>

        <p>
          Your invoice is attached with this email as a PDF.
        </p>

        <p>
          If you have any questions, feel free to reply to this email.
        </p>

        <p>— NerdDocs</p>
      </div>
    `,

    attachments: [
        {
            filename: "Logo.png",
            path: "public/Logo.png",
            cid: "invoice-logo", // 🔥 SAME ID
        },
        {
            filename: `Invoice-${order.razorpay_order_id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
        },
    ],
  });
}
