import { useState } from "react";
import {
  Input,
  Button,
  VStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const OTPForm = () => {
  const [step, setStep] = useState<"email" | "signup" | "otp">("email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const navigate = useNavigate();
  const { login } = useAuth();

  const checkEmail = async () => {
    if (!email) return toast.info("Please enter your email");
    setLoading(true); // start loading
    try {
      const res = await axios.post("https://notes-app-x9br.onrender.com/api/auth/check-email", { email });
      const exists = res.data.exists;

      if (exists) {
        await axios.post("https://notes-app-x9br.onrender.com/api/auth/send-otp", { email }, { withCredentials: true });
        toast.success("OTP sent to your email");
        setStep("otp");
      } else {
        setStep("signup");
      }
    } catch {
      toast.error("Error checking email.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  const sendSignupOtp = async () => {
    if (!name || !dob) return toast.info("Please enter name and DOB");
    setLoading(true);
    try {
      await axios.post(
        "https://notes-app-x9br.onrender.com/api/auth/send-otp",
        { email, name, dob },
        { withCredentials: true }
      );
      toast.success("Signup OTP sent");
      setStep("otp");
    } catch {
      toast.error("Signup OTP sending failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.info("Please enter OTP");
    setLoading(true);
    try {
      const res = await axios.post(
        "https://notes-app-x9br.onrender.com/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );
      login(res.data.token, res.data.name, email);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (

    <VStack align="stretch">

      {step === "email" && (
        <>
          <Heading fontSize="28px" mb={1}>
            Sign In
          </Heading>
          <Text fontSize="16px" color="gray.500" mb={6}>
            Please login to continue to your account.
          </Text>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Button
            onClick={checkEmail}
            colorPalette="blue"
            w="full"
            loading={loading}
            loadingText="Checking..."
          >
            Continue
          </Button>
        </>
      )}

      {step === "signup" && (
        <>
          <Heading fontSize="28px" mb={1}>
            Sign Up
          </Heading>
          <Text fontSize="16px" color="gray.500" mb={6}>
            Please provide the below details to signup
          </Text>
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            type="date"
          />
          <Button
            onClick={sendSignupOtp}
            colorPalette="blue"
            w="full"
            loading={loading}
            loadingText="Sending..."
          >
            Signup & Send OTP
          </Button>
        </>
      )}

      {step === "otp" && (
        <>
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            onClick={verifyOtp}
            colorPalette="blue"
            w="full"
            loading={loading}
            loadingText="Verifying..."
          >
            Verify OTP
          </Button>
        </>
      )}
    </VStack>
  );
};

export default OTPForm;
