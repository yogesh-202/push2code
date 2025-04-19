import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { parseCsv } from '@/utils/csvParser';
import path from 'path';
import fs from 'fs';

async function checkSundayLock(userId, db) {
  const today = new Date();
  const isSunday = today.getDay() === 0; // 0 is Sunday
  
  if (!isSunday) {
    return { isLocked: false };
  }

  // Get all revision problems
  const revisionProblems = await db.collection('revisionProblems')
    .find({ userId: new ObjectId(userId) })
    .toArray();

  // Get all backlog problems
  const backlogProblems = await db.collection('backlogs')
    .find({ userId: new ObjectId(userId) })
    .toArray();

  // Get all solved problems
  const solvedProblems = await db.collection('solvedProblems')
    .find({ userId: new ObjectId(userId) })
    .toArray();

  const solvedProblemIds = new Set(solvedProblems.map(sp => sp.problemId.toString()));

  // Check if all revision problems are solved
  const allRevisionSolved = revisionProblems.every(rp => 
    solvedProblemIds.has(rp.problemId.toString())
  );

  // Check if all backlog problems are solved
  const allBacklogSolved = backlogProblems.every(bp => 
    solvedProblemIds.has(bp.problemId.toString())
  );

  return {
    isLocked: !(allRevisionSolved && allBacklogSolved),
    revisionCount: revisionProblems.length,
    backlogCount: backlogProblems.length,
    solvedRevisionCount: revisionProblems.filter(rp => 
      solvedProblemIds.has(rp.problemId.toString())
    ).length,
    solvedBacklogCount: backlogProblems.filter(bp => 
      solvedProblemIds.has(bp.problemId.toString())
    ).length
  };
}

export async function GET(request) {
  try {
    // Verify token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Check Sunday lock
    const lockStatus = await checkSundayLock(payload.userId, db);

    // Get problems from database
    let problems = await db.collection('problems').find().toArray();
    
    // If no problems in database, load from CSV
    if (problems.length === 0) {
      // Read problems from CSV file
      const csvPath = path.join(process.cwd(), 'public', 'sample_problems.csv');
      let problemsData;
      
      try {
        const csvData = fs.readFileSync(csvPath, 'utf-8');
        problemsData = await parseCsv(csvData);
        
        // Insert problems into database
        if (problemsData.length > 0) {
          await db.collection('problems').insertMany(problemsData);
          problems = problemsData;
        }
      } catch (error) {
        console.error('Error loading problems from CSV:', error);
        // Fallback to sample data
        problems = generateSampleProblems();
        await db.collection('problems').insertMany(problems);
      }
    }

    // Get user's solved problems
    const userSolved = await db.collection('solvedProblems').find({
      userId: new ObjectId(payload.userId.toString())
    }).toArray();
    
    // Map solved problems to problem IDs
    const solvedProblemIds = new Set(userSolved.map(s => s.problemId.toString()));
    
    // Add solved status to problems
    const problemsWithSolvedStatus = problems.map(problem => {
      const problemId = problem._id.toString();
      const solved = solvedProblemIds.has(problemId);
      
      // Find solved info if available
      const solvedInfo = userSolved.find(s => s.problemId.toString() === problemId);
      
      return {
        _id: problemId,
        id: problemId,
        title: problem.title,
        difficulty: problem.difficulty,
        acceptance: problem.acceptance,
        frequency: problem.frequency,
        link: problem.link,
        topic: problem.topic,
        solved,
        solvedAt: solvedInfo?.solvedAt || null,
        timeSpent: solvedInfo?.timeSpent || null,
        selfRatedDifficulty: solvedInfo?.selfRatedDifficulty || null,
        isLocked: lockStatus.isLocked
      };
    });
    
    return NextResponse.json({ 
      problems: problemsWithSolvedStatus,
      lockStatus 
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { message: 'Error fetching problems' },
      { status: 500 }
    );
  }
}

// Fallback sample data if CSV fails
function generateSampleProblems() {
  const topics = ['Array', 'String', 'Linked List', 'Tree', 'Hash Table', 'Dynamic Programming', 'Graph', 'Stack', 'Queue', 'Heap'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  
  const problems = [];
  
  for (let i = 1; i <= 100; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const acceptance = Math.floor(Math.random() * 50) + 30;
    
    problems.push({
      title: `Sample Problem ${i}`,
      difficulty,
      acceptance: `${acceptance}%`,
      frequency: Math.floor(Math.random() * 5) + 1,
      link: `https://leetcode.com/problems/sample-problem-${i}`,
      topic,
    });
  }
  
  return problems;
}
