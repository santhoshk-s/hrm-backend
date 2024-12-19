import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  postalCode: { type: String, required: false },
  country: { type: String, required: false },
});

const documentSchema = new mongoose.Schema({
  image: { type: String, required: false },
  imageId: { type: String, required: false },
});

const employeeSchema = new mongoose.Schema(
  {

    address: addressSchema,
    aadhaar: documentSchema,
    pan: documentSchema,
    bank: documentSchema,

    role: {
      type: String,
      required: true,
      default: "ADMIN",
      enum: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
    },

    archived: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
