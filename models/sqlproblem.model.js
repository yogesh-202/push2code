import mongoose from 'mongoose';

const sqlproblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  leetcodeId: {
    type: String,
    required: true,
    unique: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  leetcodeLink: {
    type: String,
    required: true,
  },
  youtubeLink: {
    type: String,
  },
  revisionStatus: {
    type: Boolean,
    default: false,
  },
  lastSolvedAt: {
    type: Date,
  },
  selfRatedDifficulty: {
    type: Number,
    min: 1,
    max: 10,
  },
  solved: {
    type: Boolean,
    default: false,
  },
  timeSpent: {
    type: Number, // in minutes
    min: 0,
  },
});

// Check if the model exists before creating a new one
const SqlProblem = mongoose.models.SqlProblem || mongoose.model('SqlProblem', sqlproblemSchema);

export default SqlProblem;