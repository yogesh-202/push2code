import mongoose from 'mongoose';

const SdLectureschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String, // e.g., "09:22" in mm:ss format
    required: true,
  },
  videoId: {
    type: String, // YouTube video ID
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  moduleNumber: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true, // adds createdAt and updatedAt
});

// Create indexes for better query performance
SdLectureschema.index({ moduleNumber: 1, order: 1 });

const SdLecture = mongoose.models.SdLecture || mongoose.model('SdLecture', SdLectureschema);
export default SdLecture;
