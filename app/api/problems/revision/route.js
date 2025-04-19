import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
    
    // Get problems marked for revision
    const revisionProblems = await db.collection('revisionProblems')
      .find({ userId: decoded.userId })
      .toArray();

    // Get problem IDs for lookup
    const problemIds = revisionProblems.map(rp => rp.problemId);
    
    // Get problems in a single query
    const problems = await db.collection('problems')
      .find({ _id: { $in: problemIds } })
      .toArray();
    
    // Create a map for faster lookup
    const problemsMap = new Map(problems.map(p => [p._id.toString(), p]));
    
    // Format the response
    const formattedProblems = revisionProblems.map(rp => {
      const problem = problemsMap.get(rp.problemId.toString());
      if (!problem) return null;
      
      return {
        id: rp.problemId.toString(),
        title: problem.title,
        topic: problem.topic,
        difficulty: problem.difficulty,
        url: problem.url || problem.link,
        markedAt: rp.markedAt
      };
    }).filter(Boolean); // Remove null entries
    
    return NextResponse.json({ revisionProblems: formattedProblems });
  } catch (error) {
    console.error('Error fetching revision problems:', error);
    return NextResponse.json(
      { message: 'Error fetching revision problems' },
      { status: 500 }
    );
  }
}