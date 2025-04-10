import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

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

    // Get user
    const user = await db.collection('users').findOne({
      _id: new ObjectId(payload.userId),
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get all problems
    const problems = await db.collection('problems').find().toArray();
    
    // Get solved problems
    const solvedProblems = await db.collection('solvedProblems')
      .find({ userId: payload.userId })
      .sort({ solvedAt: -1 })
      .toArray();
    
    // Count by difficulty
    const easyTotal = problems.filter(p => p.difficulty === 'Easy').length;
    const mediumTotal = problems.filter(p => p.difficulty === 'Medium').length;
    const hardTotal = problems.filter(p => p.difficulty === 'Hard').length;
    
    const easyCount = solvedProblems.filter(sp => {
      const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
      return problem && problem.difficulty === 'Easy';
    }).length;
    
    const mediumCount = solvedProblems.filter(sp => {
      const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
      return problem && problem.difficulty === 'Medium';
    }).length;
    
    const hardCount = solvedProblems.filter(sp => {
      const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
      return problem && problem.difficulty === 'Hard';
    }).length;

    // Group by topic for progress
    const topics = [...new Set(problems.map(p => p.topic))];
    const topicProgress = topics.map(topic => {
      const topicProblems = problems.filter(p => p.topic === topic);
      const solvedTopicProblems = solvedProblems.filter(sp => {
        const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
        return problem && problem.topic === topic;
      });
      
      return {
        name: topic,
        total: topicProblems.length,
        solved: solvedTopicProblems.length,
      };
    }).sort((a, b) => (b.solved / b.total) - (a.solved / a.total));

    // Get recently solved problems (last 5)
    const recentlySolved = solvedProblems.slice(0, 5).map(sp => {
      const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
      return {
        id: sp.problemId.toString(),
        title: problem?.title || 'Unknown Problem',
        difficulty: problem?.difficulty || 'Unknown',
        topic: problem?.topic || 'Unknown',
        timeSpent: sp.timeSpent,
        solvedAt: sp.solvedAt,
      };
    });

    // Calculate stats
    const stats = {
      totalSolved: solvedProblems.length,
      easyCount,
      mediumCount,
      hardCount,
      timeSpent: user.stats.timeSpent || 0,
      streak: user.stats.streak || 0,
      joinedDate: user.createdAt,
      topicProgress,
      recentlySolved,
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { message: 'Error fetching user stats' },
      { status: 500 }
    );
  }
}
