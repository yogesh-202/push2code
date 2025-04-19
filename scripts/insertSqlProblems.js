const { connectToDatabase } = require('../lib/mongodb');
const { sqlProblemSchema } = require('../models/SqlProblem');

const sqlProblems = [
  {
    "title": "Select All Employees",
    "leetcodeId": "175",
    "difficulty": "Easy",
    "tags": ["SELECT", "Basic Queries"],
    "leetcodeLink": "https://leetcode.com/problems/combine-two-tables/",
    "youtubeLink": "https://www.youtube.com/watch?v=example2"
  },
  {
    "title": "Department Highest Salary",
    "leetcodeId": "184",
    "difficulty": "Medium",
    "tags": ["JOIN", "Aggregation", "Subquery"],
    "leetcodeLink": "https://leetcode.com/problems/department-highest-salary/",
    "youtubeLink": "https://www.youtube.com/watch?v=example1"
  },
  {
    "title": "Consecutive Numbers",
    "leetcodeId": "180",
    "difficulty": "Hard",
    "tags": ["Window Functions", "Self Join"],
    "leetcodeLink": "https://leetcode.com/problems/consecutive-numbers/",
    "youtubeLink": "https://www.youtube.com/watch?v=example3"
  }
];

async function insertProblems() {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('sqlProblems').insertMany(sqlProblems);
    console.log(`${result.insertedCount} problems inserted successfully`);
  } catch (error) {
    console.error('Error inserting problems:', error);
  }
}

insertProblems(); 