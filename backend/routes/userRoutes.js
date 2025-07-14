import express from "express";
import { loginUser, registerUser, requestOTP, verifyOTP, resetPassword } from "../controller/userController.js";
import rateLimit from "express-rate-limit";

const userRouter = express.Router();

// Rate limit for OTP requests to prevent abuse
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: { success: false, message: "Too many OTP requests, please try again later" },
});

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/request-otp", otpRequestLimiter, requestOTP);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);

export default userRouter;