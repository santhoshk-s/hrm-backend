import mongoose from 'mongoose';

const PerformanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    breakIn: [
      {
        type: Date,
        required: false,
      },
    ],
    breakOut: [
      {
        type: Date,
        required: false,
      },
    ],

    totalHours: {
      type: Number, 
      required: false,
    },

    totalBreakHours: {
      type: Number,
      required: false,
      default: 0,
    },
    
    type: {
      type: String,
      required: true,
      enum: ["Work", "Training", "Meeting"],
    },

    isLate: {
      type: Boolean,
      default: false,
    },
    isOvertime: {
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
  },
  { timestamps: true }
);

const Performance = mongoose.model("performance", PerformanceSchema);

export default Performance;
