import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { getUnsolvedCriticalProblems } from '@/utils/problemOrganizer';

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
    
    // Get user's solved problem IDs
    const solvedProblems = await db.collection('solvedProblems')
      .find({ userId: decoded.userId })
      .toArray();
    
    const solvedIds = solvedProblems.map(p => p.problemId);
    
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
    
    // Map MongoDB _id to id for consistency
    const formattedProblems = problems.map(problem => ({
      ...problem,
      id: problem._id.toString()
    }));
    
    // Get unsolved critical problems
    const criticalUnsolved = getUnsolvedCriticalProblems(
      formattedProblems,
      solvedIds,
      criticalTopics
    );
    
    return NextResponse.json({ criticalUnsolved });
  } catch (error) {
    console.error('Error fetching critical unsolved problems:', error);
    return NextResponse.json(
      { message: 'Error fetching critical unsolved problems' },
      { status: 500 }
    );
  }
}