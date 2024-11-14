import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    dates: [{ type: String }],
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved by manager", "approved by hr", "rejected"],
      default: "pending",
    },
    managerComments: { type: String },
    hrComments: { type: String },
  },
  { timestamps: true }
);

const LeaveRequest = mongoose.model("leaverequests", LeaveRequestSchema);

export default LeaveRequest;
