import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: false,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobileVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: true,
    },

    mobile: {
      type: Number,
      unique: true,
    },

    archived: {
      type: Boolean,
      default: false,
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // image: {
    //   type: String,
    //   required: false,
    // },
    // imageId: {
    //   type: String,
    //   required: false,
    // },
    // bloodGroup: { type: String, required: false, },
    // aadhaar: { image: String, imageId: String, required: false, },
    // pan: { image: String, imageId: String, required: false  },
    // bank: { image: String, imageId: String,required: false },
    // address: {
    //   type: String,
    //   required: false,
    // },
    // mobile: {
    //   type: Number,
    // },
    // bloodGroup: {
    //   type: String,
    //   required: false,
    // },
    // aadhaar: documentSchema, // Use the nested schema
    // pan: documentSchema, // Use the nested schema
    // bank: documentSchema, // Use the nested schema
    role: {
      type: String,
      required: true,
      default: "ADMIN",
      enum: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
    },
    // position: {
    //   type: String,
    //   required: false
    // },
    // empCode: {
    //   type: String,
    //   required: false
    // },
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
