import mongoose from 'mongoose';

const sqlProblemStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  solvedAt: {
    type: Date,
    required: true,
  },
  timeSpent: {
    type: Number, // in minutes
    min: 0,
    required: true,
  },
  selfRatedDifficulty: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
});



// To prevent duplicate entry for same user-problem
sqlProblemStatusSchema.index({ userId: 1, problemId: 1 }, { unique: true });

// Check if the model exists before creating a new one
const SqlProblemStatus = mongoose.models.SqlProblemStatus || mongoose.model('SqlProblemStatus', sqlProblemStatusSchema);

export default SqlProblemStatus;

