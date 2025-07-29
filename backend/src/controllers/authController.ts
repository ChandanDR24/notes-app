import { Request, Response } from "express";
import User from "../models/User";
import { sendOTPEmail } from "../utils/sendEmail";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Check if email already exists
export const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    return res.json({ exists: !!user });
  } catch (err) {
    return res.status(500).json({ error: "Error checking email" });
  }
};

// ✅ Send OTP (Login or Signup)
export const sendOTP = async (req: Request, res: Response) => {
  const { email, name, dob } = req.body;
  const otp = generateOTP();

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.otp = otp;
      await user.save();
    } else {
      if (!name || !dob) {
        return res.status(400).json({ error: "Name and DOB required for signup" });
      }
      user = new User({ email, name, dob, otp, verified: false });
      await user.save();
    }

    await sendOTPEmail(email, otp);
    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
};

// ✅ Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

  user.otp = null;
  user.verified = true;
  await user.save();

  const payload = { id: user._id, name: user.name };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({ token: accessToken, name: user.name });
};