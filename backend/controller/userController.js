import { User, OTP } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Create JWT Token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Request OTP
const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    // For reset-password, check if user exists
    if (req.path.includes("reset-password")) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry

    // Store OTP
    await OTP.findOneAndUpdate(
      { email },
      { email, otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await transporter.sendMail({
      from: `"CraveKart" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for CraveKart",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("OTP Request Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Mark user as verified (for registration)
    const user = await User.findOne({ email });
    if (user && !user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Delete OTP
    await OTP.deleteOne({ email, otp });

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }
    if (!["User", "Admin"].includes(role)) {
      return res.json({ success: false, message: "Invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false, // Require OTP verification
    });
    await newUser.save();

    res.json({ success: true, message: "Registration successful. Please verify OTP." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    if (!user.isVerified) {
      return res.json({ success: false, message: "User not verified. Please verify your email." });
    }
    if (user.role !== role) {
      return res.json({ success: false, message: "Invalid role selected" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ email, otp });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("Password Reset Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export { loginUser, registerUser, requestOTP, verifyOTP, resetPassword };