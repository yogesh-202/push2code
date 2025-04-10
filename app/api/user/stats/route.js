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
    
    // Get all problems
    const problems = await db.collection('problems').find({}).toArray();
    
    // Get user's solved problems
    const solvedProblems = await db.collection('solvedProblems')
      .find({ userId: decoded.userId })
      .toArray();
    
    const solvedIds = solvedProblems.map(p => p.problemId);
    
    // Calculate stats per topic
    const topicStats = {};
    const difficultyStats = {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    };
    
    // Calculate total problems by topic and difficulty
    problems.forEach(problem => {
      const topic = problem.topic || 'Uncategorized';
      const difficulty = (problem.difficulty || 'medium').toLowerCase();
      const isSolved = solvedIds.includes(problem._id.toString());
      
      // Update topic stats
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, solved: 0 };
      }
      
      topicStats[topic].total++;
      if (isSolved) {
        topicStats[topic].solved++;
      }
      
      // Update difficulty stats
      if (difficultyStats[difficulty]) {
        difficultyStats[difficulty].total++;
        if (isSolved) {
          difficultyStats[difficulty].solved++;
        }
      }
    });
    
    // Calculate overall stats
    const totalProblems = problems.length;
    const totalSolved = solvedProblems.length;
    const completionPercentage = totalProblems > 0 
      ? Math.round((totalSolved / totalProblems) * 100) 
      : 0;
    
    // Calculate average time spent
    const avgTimeSpent = solvedProblems.length > 0
      ? Math.round(solvedProblems.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / solvedProblems.length)
      : 0;
    
    // Format topic stats for response
    const formattedTopicStats = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      total: stats.total,
      solved: stats.solved,
      completionPercentage: stats.total > 0 
        ? Math.round((stats.solved / stats.total) * 100) 
        : 0
    }));
    
    // Sort topics by completion percentage ascending (focus areas first)
    formattedTopicStats.sort((a, b) => a.completionPercentage - b.completionPercentage);
    
    // Calculate streak (for demo purposes)
    // In a real app, this would be based on solve dates
    const streak = Math.min(7, Math.max(0, totalSolved));
    
    // Calculate recent activity (for demo purposes)
    // In a real app, this would be based on actual dates
    const recentActivity = solvedProblems
      .slice(0, 10)
      .map(solved => {
        const problem = problems.find(p => p._id.toString() === solved.problemId);
        return {
          id: solved.problemId,
          title: problem?.title || 'Unknown Problem',
          solvedAt: solved.solvedAt || new Date().toISOString(),
          difficulty: problem?.difficulty || 'medium'
        };
      });
    
    return NextResponse.json({
      summary: {
        totalProblems,
        totalSolved,
        completionPercentage,
        avgTimeSpent,
        streak
      },
      topicStats: formattedTopicStats,
      difficultyStats,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { message: 'Error fetching user statistics' },
      { status: 500 }
    );
  }
}