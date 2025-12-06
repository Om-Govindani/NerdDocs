import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

import User from "../models/User.js"
import Otp from "../models/Otp.js"

import {sendEmailOtp} from "../utils/emailSender.js"

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//Request OTP

router.post("/request-otp" , async (req , res) => {
    try{
        const {email , purpose} = req.body;

        if(!email) 
            return res.status(400).json({error: "Email Required"});
        if(!["login" , "signup"].includes(purpose)) 
            return res.status(400).json({error: "Invalid Purpose"});
        
        let user = await User.findOne({email});

        if(purpose === "login" && !user)
            return res.status(400).json({error: "User doesn't exists"});
        if(purpose === "signup" && user)
            return res.status(400).json({error: "User already exists"});
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp , 10);
        
        await Otp.create({
            email,
            otpHash,
            purpose,
            expiresAt : new Date(Date.now() + 5 * 60 * 1000)
        })

        await sendEmailOtp(email,otp);
        res.json({success: true , message: "OTP sent successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Server Error"})
    }
})

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, purpose, otp } = req.body;

    const record = await Otp.findOne({
      email,
      purpose,
      used: false,
    }).sort({ createdAt: -1 });

    if (!record) return res.status(400).json({ error: "OTP not found" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ error: "OTP expired" });

    const valid = await bcrypt.compare(otp, record.otpHash);
    if (!valid) return res.status(400).json({ error: "Invalid OTP" });

    record.used = true;
    await record.save();

    let user = await User.findOne({ email });

    // Signup → create new user
    if (purpose === "signup" && !user) {
      user = await User.create({
        email,
        isEmailVerified: true,
        myCourses: [],
      });
    }

    // For login, user must exist
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isEmailVerified = true;
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;