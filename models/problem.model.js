import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  leetcodeId: {
    type: String,
    required: true,
    unique: true,
  },
  leetcodeLink: {
    type: String,
    required: true,
  },
  youtubeLink: {
    type: String,
    default: '', // Optional, can be empty
  },
  lockstatus: {
    type: Boolean,
    default: false, // Indicates if the problem is locked
  }
}, {
  timestamps: true
});

// Check if the model exists before creating a new one
const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);

export default Problem;