import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { getRevisionProblems } from '@/utils/problemOrganizer';

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
    
    // Convert MongoDB solved problems to the format we need
    const formattedSolvedProblems = solvedProblems.map(solved => {
      const problem = problems.find(p => p._id.toString() === solved.problemId);
      if (!problem) return null;
      
      return {
        id: solved.problemId,
        title: problem.title,
        topic: problem.topic,
        difficulty: problem.difficulty,
        url: problem.url,
        solvedAt: solved.solvedAt,
        timeSpent: solved.timeSpent
      };
    }).filter(Boolean); // Remove null entries
    
    // Get critical topics
    const response = await fetch(`${request.nextUrl.origin}/api/user/critical-topics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch critical topics');
    }
    
    const { criticalTopics } = await response.json();
    
    // Get revision problems
    const revisionProblems = getRevisionProblems(
      problems,
      formattedSolvedProblems,
      criticalTopics,
      5 // Get 5 problems for weekly revision
    );
    
    return NextResponse.json({ revisionProblems });
  } catch (error) {
    console.error('Error fetching revision problems:', error);
    return NextResponse.json(
      { message: 'Error fetching revision problems' },
      { status: 500 }
    );
  }
}