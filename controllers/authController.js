import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logAuditAction from "../middleware/auditLogsMiddleware.js";

export const register = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await logAuditAction(existingUser._id, 'REGISTER FAILED', 'User Authentication', `${email} already existed`);

      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({ userName, email, password });
    await user.save();
    await logAuditAction(user._id, 'REGISTER SUCCESS', 'User Authentication', 'User registered successfully');
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user){
      return res.status(404).json({ message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      await logAuditAction(user._id, 'LOGIN FAILED', 'User Authentication', 'Incorrect password');
    return res.status(404).json({ message: "Invalid credentials" });}
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    await logAuditAction(user._id, 'LOGIN SUCCESS', 'User Authentication', 'User logged in successfully');
    return res.status(200).json({ message: "Login successful", data: token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
