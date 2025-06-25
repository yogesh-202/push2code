import mongoose from 'mongoose';

const cfproblemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  contestId: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    enum: [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700],
  },
  tags: {
    type: [String],
  },
  index: {
    type: String,
    required: true,
  },
});

const CfProblem = mongoose.models.cfproblem || mongoose.model('cfproblem', cfproblemSchema);
export default CfProblem;
