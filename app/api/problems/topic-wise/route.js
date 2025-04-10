import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { organizeByTopicAndDifficulty } from '@/utils/problemOrganizer';

export async function GET(request) {
  try {
    // Validate token
    const token = request.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Get all problems
    const problems = await db.collection('problems').find({}).toArray();
    
    // Get user's solved problems
    const solvedProblems = await db.collection('solvedProblems')
      .find({ userId: decoded.userId })
      .toArray();
    
    // Create set of solved problem IDs for faster lookup
    const solvedIds = new Set(solvedProblems.map(p => p.problemId));
    
    // Add solved property to each problem
    const problemsWithSolvedState = problems.map(problem => ({
      ...problem,
      solved: solvedIds.has(problem._id.toString())
    }));
    
    // Organize problems by topic and difficulty
    const organizedProblems = organizeByTopicAndDifficulty(problemsWithSolvedState);
    
    return NextResponse.json({ organizedProblems });
  } catch (error) {
    console.error('Error fetching topic-wise problems:', error);
    return NextResponse.json(
      { message: 'Error fetching problems' },
      { status: 500 }
    );
  }
}