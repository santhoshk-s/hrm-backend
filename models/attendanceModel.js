import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    arrivalDate: {
      type: Date,
    },
    departureDate: {
      type: Date,
    },
    image: {
      type: String,
    },
    imageId: {
      type: String,
    },
    attendanceStatus: {
      type: String,
      default:"present",
      ennum:["present","absent"]
    },
    userRemark:{
      type: String,
    },
    adminResponse:{
      type: String,
    },
    status:{
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Attendance = mongoose.model("attendances", attendanceSchema);

export default Attendance;
