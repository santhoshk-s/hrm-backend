import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    arrivalDate: {
      type: Date,
    },
    departureDate: {
      type: Date,
      default:null
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
      default:null
    },
    adminRemark:{
      type: String,
      default:null
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
