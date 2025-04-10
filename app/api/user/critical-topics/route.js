import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

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
    
    // Get all problems to extract unique topics
    const problems = await db.collection('problems').find({}).toArray();
    
    // Get all topics from problems
    const allTopics = [...new Set(problems.map(p => p.topic))].filter(Boolean);
    
    // Create sample critical topics for demo purposes
    // In a real app, this would be based on sophisticated analysis of user's performance
    const criticalTopics = allTopics.slice(0, 3).map(name => ({
      name,
      completionRate: 0.4, // 40% completion
      avgTimeSpent: 45 // average 45 minutes per problem
    }));
    
    return NextResponse.json({ criticalTopics });
  } catch (error) {
    console.error('Error fetching critical topics:', error);
    return NextResponse.json(
      { message: 'Error fetching critical topics' },
      { status: 500 }
    );
  }
}