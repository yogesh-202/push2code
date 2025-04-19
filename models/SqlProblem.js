// SQL Problem Schema Definition
const sqlProblemSchema = {
  // Required fields
  title: {
    type: String,
    required: true,
    unique: true,
    description: 'Title of the SQL problem'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    description: 'Difficulty level of the problem'
  },
  tags: {
    type: Array,
    required: true,
    description: 'Array of SQL concepts/topics covered in the problem'
  },
  leetcodeId: {
    type: String,
    required: true,
    unique: true,
    description: 'LeetCode problem ID'
  },
  description: {
    type: String,
    required: true,
    description: 'Problem description/statement'
  },

  // Optional fields
  schema: {
    type: String,
    description: 'Database schema required for the problem'
  },
  sampleData: {
    type: String,
    description: 'Sample data for testing the SQL query'
  },
  expectedOutput: {
    type: String,
    description: 'Expected output format'
  },
  hints: {
    type: Array,
    default: [],
    description: 'Array of hints for solving the problem'
  },
  solution: {
    type: String,
    description: 'Reference solution for the problem'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    description: 'Timestamp when the problem was created'
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    description: 'Timestamp when the problem was last updated'
  }
};

// Indexes for efficient querying
const indexes = [
  { key: { title: 1 }, unique: true },
  { key: { leetcodeId: 1 }, unique: true },
  { key: { difficulty: 1 } },
  { key: { tags: 1 } }
];

module.exports = {
  sqlProblemSchema,
  indexes,
  collectionName: 'sqlProblems'
}; 