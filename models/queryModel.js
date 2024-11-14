import mongoose from "mongoose";

const QuerySchame = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    response: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Query = mongoose.model("querys", QuerySchame);

export default Query;
