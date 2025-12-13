import express from "express";
import authMiddleware from "../middleware/auth.js";
import * as authCtrl from "../controllers/authController.js";

const router = express.Router();
router.post("/request-otp", authCtrl.requestOtp);
router.post("/verify-otp", authCtrl.verifyOtp);
router.get("/refresh", authCtrl.refresh);
router.get("/me", authMiddleware, authCtrl.me);
router.post("/logout", authCtrl.logout);

export default router;
