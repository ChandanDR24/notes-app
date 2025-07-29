import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    dob: { type: String },
    email: { type: String, required: true, unique: true },
    otp: { type: String },
    verified: { type: Boolean, default: false },
    authType: { type: String, enum: ["email", "google"], default: "email" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
