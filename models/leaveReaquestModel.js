import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    managerComments: { type: String },
    hrComments: { type: String },

    leaveStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    leaveType: {
      type: String,
      enum: ["CASUAL_LEAVE", "SICK_LEAVE", "EARNED_LEAVE", "UNPAID_LEAVE"],
      default: "CASUAL_LEAVE",
    },

    leaveDayType: {
      type: String,
      enum: ["FIRST_HALF", "SECOND_HALF", "FULL_DAY"],
      default: "FIRST_HALF",
    },

    fromDate: {
      type: Date,
    },

    toDate: {
      type: Date,
    },

    numberOfDaysLeave: {
      type: Number,
    },

    totalLeaveThisMonth: {
      type: Number,
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

const LeaveRequest = mongoose.model("leave", LeaveRequestSchema);

export default LeaveRequest;
