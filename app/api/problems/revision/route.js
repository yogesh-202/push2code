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
    
    // Get problems marked for revision
    const markedForRevision = await db.collection('revisionProblems')
      .find({ userId: decoded.userId })
      .toArray();

    // Get all problems marked for revision
    const revisionProblems = problems
      .filter(problem => markedForRevision.some(
        marked => marked.problemId.toString() === problem._id.toString()
      ))
      .map(problem => ({
        id: problem._id.toString(),
        title: problem.title,
        difficulty: problem.difficulty,
        topic: problem.topic,
        link: problem.link,
        markedAt: markedForRevision.find(
          m => m.problemId.toString() === problem._id.toString()
        )?.markedAt
      }));
    
    return NextResponse.json({ revisionProblems });
  } catch (error) {
    console.error('Error fetching revision problems:', error);
    return NextResponse.json(
      { message: 'Error fetching revision problems' },
      { status: 500 }
    );
  }
}