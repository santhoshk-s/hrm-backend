import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logAuditAction from "../middleware/auditLogsMiddleware.js";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { firstName, lastName, mobile, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email, archived: false });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({ firstName, email, mobile, password });
    const result = await user.save();

    console.log(result, "result");

    await logAuditAction(
      result._id,
      "REGISTER SUCCESS",
      "User Authentication",
      "User registered successfully"
    );

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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    await logAuditAction(
      user._id,
      "LOGIN SUCCESS",
      "User Authentication",
      "User logged in successfully"
    );
    return res
      .status(200)
      .json({ message: "Login successful", data: token, role: user.role });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
