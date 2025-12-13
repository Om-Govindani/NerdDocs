import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendEmailOtp } from "../utils/emailSender.js";
import { signAccess, signRefresh, verifyRefresh } from "../utils/token.js";



function hashEmail(email) {
  return crypto.createHash("sha256").update(email).digest("hex");
}
function encryptEmail(email) {
  // simple reversible pseudo example - replace with real AES in production
  return Buffer.from(email).toString("base64");
}

export const requestOtp = async (req, res) => {
  try {
    const { email, purpose } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    if (!["login","signup"].includes(purpose)) return res.status(400).json({ error: "Invalid purpose" });

    const user = await User.findOne({ emailHash: hashEmail(email) });

    if (purpose === "login" && !user) return res.status(400).json({ error: "User not found" });
    if (purpose === "signup" && user) return res.status(400).json({ error: "User exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    await Otp.create({ email, otpHash, purpose, expiresAt: new Date(Date.now() + 5*60*1000) });
    await sendEmailOtp(email, otp);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, purpose, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Missing fields" });

    const record = await Otp.findOne({ email, purpose, used: false }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ error: "OTP not found" });
    if (record.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired" });

    const valid = await bcrypt.compare(otp, record.otpHash);
    if (!valid) return res.status(400).json({ error: "Invalid OTP" });

    record.used = true;
    await record.save();

    let user = await User.findOne({ emailHash: crypto.createHash("sha256").update(email).digest("hex") });

    if (purpose === "signup" && !user) {
      user = await User.create({
        user_id: `U${Date.now()}`,
        firstName: "",
        lastName: "",
        emailEncrypted: encryptEmail(email),
        emailHash: crypto.createHash("sha256").update(email).digest("hex"),
        isEmailVerified: true
      });
    }
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isEmailVerified = true;
    await user.save();
    
    const accessToken = signAccess({ userId: String(user._id) });
    const refreshToken = signRefresh({ userId: String(user._id) });

    // cookie options
    const dev = process.env.NODE_ENV !== "production";
    const cookieOpts = (maxAge) => ({
      httpOnly: true,
      secure: !dev,
      sameSite: dev ? "lax" : "none",
      maxAge
    });

    

    res.cookie("accessToken", accessToken, cookieOpts(15*60*1000))
       .cookie("refreshToken", refreshToken, cookieOpts(30*24*60*60*1000))
       .json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "Missing refresh token" });
    const data = verifyRefresh(refreshToken);
    const newAccess = signAccess({ userId: data.userId });
    const dev = process.env.NODE_ENV !== "production";
    res.cookie("accessToken", newAccess, { httpOnly: true, secure: !dev, sameSite: dev ? "lax" : "none", maxAge: 15*60*1000 })
       .json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Invalid refresh token" });
  }
};

export const me = async (req, res) => {
  const User = (await import("../models/User.js")).default;
  try {
    const user = await User.findById(req.user.userId).select("-emailEncrypted -__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req, res) => {
  const dev = process.env.NODE_ENV !== "production";
  res.clearCookie("accessToken", { httpOnly: true, secure: !dev, sameSite: dev ? "lax" : "none" })
     .clearCookie("refreshToken", { httpOnly: true, secure: !dev, sameSite: dev ? "lax" : "none" })
     .json({ success: true });
};
