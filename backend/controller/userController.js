import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login User
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't Exist" });
    }
    if (user.role !== role) {
      return res.json({ success: false, message: "Invalid Role Selected" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = createToken(user._id, user.role);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create JWT Token
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET);
};

// Register User
const registerUser = async (req, res) => {
  const { name, password, email, role } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please Enter Valid Email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter Strong Password",
      });
    }
    if (!["User", "Admin"].includes(role)) {
      return res.json({ success: false, message: "Invalid Role" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });
    const user = await newUser.save();
    const token = createToken(user._id, user.role);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
