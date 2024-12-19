import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["National", "Local", "Company-Specific"],
      default: "National",
    },

    description: {
      type: String,
      required: false,
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    archived: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Holiday = mongoose.model("holiday", HolidaySchema);

export default Holiday;
