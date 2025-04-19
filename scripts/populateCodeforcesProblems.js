import { connectToDatabase } from '../lib/mongodb';
import fs from 'fs';
import path from 'path';

// Sample curated Codeforces problems
const curatedProblems = [
  {
    contestId: 4,
    index: 'A',
    name: 'Watermelon',
    type: 'PROGRAMMING',
    rating: 800,
    tags: ['brute force', 'math'],
  },
  {
    contestId: 71,
    index: 'A',
    name: 'Way Too Long Words',
    type: 'PROGRAMMING',
    rating: 800,
    tags: ['strings'],
  },
  {
    contestId: 158,
    index: 'A',
    name: 'Next Round',
    type: 'PROGRAMMING',
    rating: 800,
    tags: ['implementation'],
  },
  {
    contestId: 118,
    index: 'A',
    name: 'String Task',
    type: 'PROGRAMMING',
    rating: 1000,
    tags: ['implementation', 'strings'],
  },
  {
    contestId: 50,
    index: 'A',
    name: 'Domino piling',
    type: 'PROGRAMMING',
    rating: 800,
    tags: ['greedy', 'math'],
  },
  {
    contestId: 231,
    index: 'A',
    name: 'Team',
    type: 'PROGRAMMING',
    rating: 800,
    tags: ['brute force', 'greedy'],
  },
  {
    contestId: 282,
    index: 'A',
    name: 'Bit++',
    type: 'PROGRAMMING',
    rating: 800,
    tags: ['implementation'],
  },
  {
    contestId: 96,
    index: 'A',
    name: 'Football',
    type: 'PROGRAMMING',
    rating: 900,
    tags: ['implementation', 'strings'],
  },
  {
    contestId: 112,
    index: 'A',
    name: 'Petya and Strings',
    type: 'PROGRAMMING',
    rating: 800,
    tags: ['implementation', 'strings'],
  },
  {
    contestId: 339,
    index: 'A',
    name: 'Helpful Maths',
    type: 'PROGRAMMING',
    rating: 800,
    tags: ['greedy', 'implementation', 'sortings', 'strings'],
  },
  // Add more problems as needed
];

async function populateDatabase() {
  try {
    const { db } = await connectToDatabase();
    
    // Clear existing problems
    await db.collection('codeforcesProblems').deleteMany({});
    
    // Insert new problems
    const result = await db.collection('codeforcesProblems').insertMany(curatedProblems);
    
    console.log(`Successfully inserted ${result.insertedCount} problems`);
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase(); 