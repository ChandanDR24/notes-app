import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateAccessToken } from "../utils/tokenUtils";

const router = express.Router();

// 🔹 1. Google login trigger
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 🔹 2. Google callback handler
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user as any;

    try {
      // ✅ Check if user exists in DB
      let existingUser = await User.findOne({ email: user.email });

      // ✅ Create user if not found
      if (!existingUser) {
        const name = user.name || "User";
        existingUser = await User.create({
          email: user.email,
          name,
          verified: true,
          authType: "google",
        });
      }

      // ✅ Access Token (15 min)
      const accessToken = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );

      // ✅ Refresh Token (7 days)
      const refreshToken = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
      );

      // ✅ Set refresh token in httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // Change to true in production
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const name = existingUser.name || "User";
      const email = existingUser.email;
      // ✅ Redirect to frontend with access token and name
      res.redirect(
        `https://notes-app-steel-two.vercel.app/dashboard?token=${accessToken}&name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      console.error("Google login failed:", err);
      res.redirect("https://notes-app-steel-two.vercel.app/login?error=google_login_failed");
    }
  }
);

// 🔹 3. Email existence check (used before OTP)
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  return res.json({ exists: !!user });
});

// 🔹 4. Refresh token handler
router.post("/refresh-token", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = generateAccessToken({ id: user._id, name: user.name });

    return res.json({
      token: newAccessToken,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
});

export default router;



