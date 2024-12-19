import mongoose from "mongoose";

const LeaveAllocationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    leaveType: {
      type: String,
      enum: ["CASUAL_LEAVE", "SICK_LEAVE", "EARNED_LEAVE", "UNPAID_LEAVE"],
      default: "CASUAL_LEAVE",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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

const LeaveAllocation = mongoose.model("leave-balance", LeaveAllocationSchema);

export default LeaveAllocation;
