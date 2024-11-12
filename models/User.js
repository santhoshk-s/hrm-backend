import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    image: { type: String },
    imageId: { type: String },
    address: { type: String },
    mobile: {
      type: Number,
    },
    bloodGroup: { type: String },
    aadhaar: { image: String, imageId: String },
    pan: { image: String, imageId: String },
    bank: { image: String, imageId: String },
    role: {
      type: String,
      required: true,
      default: "employee",
      enum: ["admin", "hr", "manager", "employee"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("users", userSchema);

export default User;
