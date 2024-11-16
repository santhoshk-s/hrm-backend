import mongoose, { model } from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
    },
    candidateEmail: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    position: {
      type: String,
    },
    skills: {
      type: String,
    },
    address: {
      type: String,
    },
    experience: {
      type: String,
    },
    date:{
      type:Date
    },
    resume: {
      type: String,
    },
    resumeId: {
      type: String,
    },
    status: {
      type: String,
      default:"pending",
      enum: ["hire", "reject", "pending"],
    },
  },
  { timestamps: true }
);

const Interviews = mongoose.model("interviews", InterviewSchema);

export default Interviews;
