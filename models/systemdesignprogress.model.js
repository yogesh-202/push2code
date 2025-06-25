import mongoose from 'mongoose';

const systemDesignProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastWatchedAt: {
      type: Date,
      default: null,
    },
    watchDuration: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Corrected and safe model export
const SystemDesignProgress =
  mongoose.models.SystemDesignProgress ||
  mongoose.model("SystemDesignProgress", systemDesignProgressSchema);

export default SystemDesignProgress;
