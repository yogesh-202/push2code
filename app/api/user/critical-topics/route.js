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

    // Get all problems
    const problems = await db.collection('problems').find().toArray();
    
    // Get solved problems
    const solvedProblems = await db.collection('solvedProblems')
      .find({ userId: payload.userId })
      .toArray();
    
    // Group all problems by topic
    const topics = [...new Set(problems.map(p => p.topic))];
    
    // Extract difficulty distribution
    const difficultyStats = {
      easy: {
        total: problems.filter(p => p.difficulty === 'Easy').length,
        solved: solvedProblems.filter(sp => {
          const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
          return problem && problem.difficulty === 'Easy';
        }).length
      },
      medium: {
        total: problems.filter(p => p.difficulty === 'Medium').length,
        solved: solvedProblems.filter(sp => {
          const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
          return problem && problem.difficulty === 'Medium';
        }).length
      },
      hard: {
        total: problems.filter(p => p.difficulty === 'Hard').length,
        solved: solvedProblems.filter(sp => {
          const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
          return problem && problem.difficulty === 'Hard';
        }).length
      }
    };

    // Find time performance
    let averageTime = 0;
    let fastestSolve = { problem: '', time: Infinity };
    let slowestSolve = { problem: '', time: 0 };
    
    if (solvedProblems.length > 0) {
      averageTime = Math.round(
        solvedProblems.reduce((acc, sp) => acc + sp.timeSpent, 0) / solvedProblems.length
      );
      
      // Find fastest solve
      const fastest = solvedProblems.reduce((prev, current) => 
        prev.timeSpent < current.timeSpent ? prev : current
      );
      const fastestProblem = problems.find(p => p._id.toString() === fastest.problemId.toString());
      fastestSolve = {
        problem: fastestProblem?.title || 'Unknown Problem',
        time: fastest.timeSpent
      };
      
      // Find slowest solve
      const slowest = solvedProblems.reduce((prev, current) => 
        prev.timeSpent > current.timeSpent ? prev : current
      );
      const slowestProblem = problems.find(p => p._id.toString() === slowest.problemId.toString());
      slowestSolve = {
        problem: slowestProblem?.title || 'Unknown Problem',
        time: slowest.timeSpent
      };
    }
    
    const timePerformance = {
      averageTime,
      fastestSolve,
      slowestSolve
    };

    // Calculate topic performance for radar chart
    const topicPerformance = topics.map(topic => {
      const topicProblems = problems.filter(p => p.topic === topic);
      const topicSolved = solvedProblems.filter(sp => {
        const problem = problems.find(p => p._id.toString() === sp.problemId.toString());
        return problem && problem.topic === topic;
      });
      
      // Calculate average time for this topic
      const topicTimes = topicSolved.map(sp => sp.timeSpent);
      const avgTime = topicTimes.length > 0
        ? Math.round(topicTimes.reduce((a, b) => a + b, 0) / topicTimes.length)
        : 0;
      
      // Calculate completion percentage
      const completionRate = topicProblems.length > 0
        ? (topicSolved.length / topicProblems.length) * 100
        : 0;
      
      return {
        topic,
        completionRate: Math.round(completionRate),
        averageTime: avgTime,
        totalProblems: topicProblems.length,
        solvedProblems: topicSolved.length
      };
    });

    // Identify critical topics based on:
    // 1. Low completion rate compared to average
    // 2. Higher than average solution time
    // 3. Lower than 30% completion
    
    // Calculate overall average completion rate
    const overallCompletion = topicPerformance.reduce((acc, curr) => 
      acc + curr.completionRate, 0) / topicPerformance.length;
    
    // Calculate overall average time
    const overallTime = topicPerformance.reduce((acc, curr) => 
      acc + curr.averageTime, 0) / topicPerformance.filter(t => t.averageTime > 0).length;
    
    // Identify critical topics
    const criticalTopics = topicPerformance
      .filter(topic => 
        (topic.completionRate < overallCompletion * 0.7 || topic.completionRate < 30) && 
        topic.totalProblems > 0
      )
      .map(topic => {
        let reason = '';
        
        if (topic.solvedProblems === 0) {
          reason = `You haven't solved any problems in this topic yet.`;
        } else if (topic.completionRate < 30) {
          reason = `Low completion rate (${topic.completionRate}%).`;
        } else if (topic.averageTime > overallTime * 1.2) {
          reason = `Takes longer than average to solve (${topic.averageTime} mins vs. ${Math.round(overallTime)} mins average).`;
        } else {
          reason = `Below average completion rate compared to other topics.`;
        }
        
        return {
          name: topic.topic,
          solved: topic.solvedProblems,
          total: topic.totalProblems,
          completionRate: topic.completionRate,
          averageTime: topic.averageTime,
          reason,
          criticalScore: (100 - topic.completionRate) + (topic.averageTime / 10)
        };
      })
      .sort((a, b) => b.criticalScore - a.criticalScore)
      .slice(0, 5);

    // Generate mock monthly activity data (last 30 days)
    const today = new Date();
    const monthlyActivity = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Count problems solved on this date
      const dayProblems = solvedProblems.filter(sp => {
        const solvedDate = new Date(sp.solvedAt);
        return (
          solvedDate.getDate() === date.getDate() &&
          solvedDate.getMonth() === date.getMonth() &&
          solvedDate.getFullYear() === date.getFullYear()
        );
      });
      
      monthlyActivity.push({
        date: date.toISOString().split('T')[0],
        count: dayProblems.length
      });
    }

    return NextResponse.json({
      topicPerformance,
      difficultyStats,
      timePerformance,
      criticalTopics,
      monthlyActivity
    });
  } catch (error) {
    console.error('Error calculating critical topics:', error);
    return NextResponse.json(
      { message: 'Error calculating critical topics' },
      { status: 500 }
    );
  }
}
