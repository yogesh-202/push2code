import mongoose from 'mongoose';

const sdmoduleSchema = new mongoose.Schema({
  moduleNumber: {
    type: Number,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  duration: {
    type: String, // e.g., "1h 33m"
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true, // optional: adds createdAt and updatedAt
});

export default mongoose.models.sdModule || mongoose.model('sdModule', sdmoduleSchema);
