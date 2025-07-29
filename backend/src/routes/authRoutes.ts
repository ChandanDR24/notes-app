import express from "express";
import { sendOTP, verifyOTP, checkEmail } from "../controllers/authController";

const router = express.Router();

router.post("/check-email", checkEmail);   // ✅ New
router.post("/send-otp", sendOTP);         // ✅ Updated
router.post("/verify-otp", verifyOTP);     // ✅ Returns token + user info

export default router;
