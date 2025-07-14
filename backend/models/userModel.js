import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
      required: true,
    },
    cartData: { type: Object, default: {} },
    isVerified: { type: Boolean, default: false }, // For OTP verification
  },
  { minimize: false }
);

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const User = mongoose.models.user || mongoose.model("user", userSchema);
const OTP = mongoose.models.OTP || mongoose.model("OTP", otpSchema);

export { User, OTP };
export default User;