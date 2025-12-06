import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmailOtp(to, otp) {
  await transporter.sendMail({
    from: `"NerdDocs" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your NerdDocs OTP Code",
    html: `
      <div style="font-family: Arial; font-size: 16px;">
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
    `,
  });
}
