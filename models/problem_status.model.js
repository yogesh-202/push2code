import mongoose from 'mongoose';

const userProblemStatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
  setToDailyGoal: {
    type: Boolean,
    default: false,
  },
  setToRevision: {
    type: Boolean,
    default: false,
  },
  setToBacklog: {
    type: Boolean,
    default: false,
  },
  timespent: {
    type: Number,
    default: 0, // in seconds
  },
  solvedAt: {
    type: Date,
  },
  selfRatedDifficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', '1', '2', '3'],
    default: 'Easy',
    set: function(value) {
      // Convert number to string if needed
      if (typeof value === 'number') {
        switch(value) {
          case 1: return 'Easy';
          case 2: return 'Medium';
          case 3: return 'Hard';
          default: return 'Easy';
        }
      }
      return value;
    }
  },
  dailyGoalAssignedDate: {
    type: String
  }
}, {
  timestamps: true
});

// To prevent duplicate entry for same user-problem
userProblemStatusSchema.index({ userId: 1, problemId: 1 }, { unique: true });

// Check if the model exists before creating a new one
const UserProblemStatus = mongoose.models.UserProblemStatus || mongoose.model('UserProblemStatus', userProblemStatusSchema);

export default UserProblemStatus;

