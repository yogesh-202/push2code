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
    
    // Get all topics from problems
    const allTopics = [...new Set(problems.map(p => p.topic))].filter(Boolean);
    
    // Create sample critical topics if needed for demonstration
    // In a real app, this would be based on actual user performance
    const criticalTopics = allTopics.slice(0, 3).map(name => ({
      name,
      completionRate: 0.4,
      avgTimeSpent: 45
    }));
    
    // If we have no solved problems yet, just return an empty array
    if (formattedSolvedProblems.length === 0) {
      return NextResponse.json({ revisionProblems: [] });
    }
    
    // Get revision problems (or just return some solved problems for the demo)
    // In a real app with sufficient data, we would use the getRevisionProblems function
    const revisionProblems = formattedSolvedProblems.slice(0, 5);
    
    return NextResponse.json({ revisionProblems });
  } catch (error) {
    console.error('Error fetching revision problems:', error);
    return NextResponse.json(
      { message: 'Error fetching revision problems' },
      { status: 500 }
    );
  }
}