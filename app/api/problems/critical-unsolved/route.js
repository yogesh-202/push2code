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
    
    // Get all topics from problems
    const allTopics = [...new Set(problems.map(p => p.topic))].filter(Boolean);
    
    // Create sample critical topics if needed for demonstration
    // In a real app, this would be based on actual user performance analysis
    const sampleCriticalTopics = allTopics.slice(0, 3).map(name => ({
      name,
      completionRate: 0.4,
      avgTimeSpent: 45
    }));
    
    // Map MongoDB _id to id for consistency
    const formattedProblems = problems.map(problem => ({
      ...problem,
      id: problem._id.toString()
    }));
    
    // Create a simple object of unsolved problems by topic
    const criticalUnsolved = {};
    
    // For each critical topic, find unsolved problems
    sampleCriticalTopics.forEach(topic => {
      const topicName = topic.name;
      const topicProblems = formattedProblems.filter(problem => 
        problem.topic === topicName && !solvedIds.includes(problem.id)
      );
      
      if (topicProblems.length > 0) {
        criticalUnsolved[topicName] = topicProblems.slice(0, 5); // Limit to 5 problems per topic
      }
    });
    
    return NextResponse.json({ criticalUnsolved });
  } catch (error) {
    console.error('Error fetching critical unsolved problems:', error);
    return NextResponse.json(
      { message: 'Error fetching critical unsolved problems' },
      { status: 500 }
    );
  }
}