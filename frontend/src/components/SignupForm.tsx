// src/components/SignupForm.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const SignupForm = ({ email }: { email: string }) => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const sendOtp = async () => {
    try {
      await axios.post("https://notes-app-x9br.onrender.com/api/auth/send-otp", {
        email,
        name,
        dob,
      }, { withCredentials: true });

      setOtpSent(true);
      toast.success("OTP sent to your email.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "https://notes-app-x9br.onrender.com/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      // Set both token and name from response
      login(res.data.token, res.data.name,email);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Invalid OTP or signup failed");
    }
  };

  return (
    <div className="space-y-3 max-w-sm mx-auto mt-6">
      {!otpSent ? (
        <>
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white py-2 w-full rounded"
            onClick={sendOtp}
          >
            Sign Up & Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-2 w-full rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="bg-green-600 text-white py-2 w-full rounded"
            onClick={verifyOtp}
          >
            Verify OTP & Complete Signup
          </button>
        </>
      )}
    </div>
  );
};

export default SignupForm;
