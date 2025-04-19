import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Verify token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Get time range from query params
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    // Connect to database
    const { db } = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ message: 'Database connection failed' }, { status: 500 });
    }

    // Convert userId to ObjectId
    const userId = new ObjectId(payload.userId);

    // Calculate date range for performance metrics
    const now = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get ALL solved problems (without time range restriction)
    const allSolvedProblems = await db.collection('solvedProblems')
      .aggregate([
        {
          $match: {
            userId: userId // Using ObjectId for comparison
          }
        },
        {
          $lookup: {
            from: 'problems',
            localField: 'problemId',
            foreignField: '_id',
            as: 'problemDetails'
          }
        },
        {
          $unwind: {
            path: '$problemDetails',
            preserveNullAndEmptyArrays: true // Keep solved problems even if problem details are missing
          }
        }
      ]).toArray();

    // Get time-ranged solved problems for performance metrics
    const recentSolvedProblems = await db.collection('solvedProblems')
      .aggregate([
        {
          $match: {
            userId: userId,
            solvedAt: { $gte: startDate }
          }
        },
        {
          $lookup: {
            from: 'problems',
            localField: 'problemId',
            foreignField: '_id',
            as: 'problemDetails'
          }
        },
        {
          $unwind: {
            path: '$problemDetails',
            preserveNullAndEmptyArrays: true
          }
        }
      ]).toArray();

    // Get all problems for total count
    const totalProblems = await db.collection('problems').countDocuments();

    // Calculate overview stats using ALL solved problems
    const overview = {
      totalProblems,
      solvedProblems: allSolvedProblems.length,
      averageTime: allSolvedProblems.length > 0
        ? Math.round(allSolvedProblems.reduce((acc, curr) => acc + (curr.timeSpent || 0), 0) / allSolvedProblems.length)
        : 0,
      streak: await calculateStreak(db, userId),
      accuracy: allSolvedProblems.length > 0
        ? Math.round((allSolvedProblems.filter(p => p.problemDetails?.difficulty?.toLowerCase() === 'easy').length / allSolvedProblems.length) * 100)
        : 0
    };

    // Calculate performance trends using time-ranged data
    const performance = {
      daily: await calculateDailyPerformance(db, userId, startDate),
      weekly: await calculateWeeklyPerformance(db, userId, startDate),
      monthly: await calculateMonthlyPerformance(db, userId, startDate)
    };

    // Calculate topic performance using ALL solved problems
    const topics = await calculateTopicPerformance(db, userId, allSolvedProblems);

    // Calculate difficulty distribution using ALL solved problems
    const difficulty = await calculateDifficultyDistribution(db, userId);

    // Calculate time analysis using ALL solved problems
    const timeAnalysis = await calculateTimeAnalysis(allSolvedProblems);

    // Generate recommendations based on ALL data
    const recommendations = generateRecommendations(topics, difficulty, timeAnalysis);

    return NextResponse.json({
      overview,
      performance,
      topics,
      difficulty,
      timeAnalysis,
      recommendations
    });

  } catch (error) {
    console.error('Error in analytics route:', error);
    return NextResponse.json(
      { message: 'Error fetching analytics data', error: error.message },
      { status: 500 }
    );
  }
}

async function calculateStreak(db, userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = today;

  while (true) {
    const submission = await db.collection('solvedProblems').findOne({
      userId: userId, // Using ObjectId for comparison
      solvedAt: {
        $gte: currentDate,
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!submission) break;
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

async function calculateDailyPerformance(db, userId, startDate) {
  const result = await db.collection('solvedProblems').aggregate([
    {
      $match: {
        userId: userId, // Using ObjectId for comparison
        solvedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$solvedAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]).toArray();

  return result.map(r => ({
    date: r._id,
    count: r.count
  }));
}

async function calculateWeeklyPerformance(db, userId, startDate) {
  const result = await db.collection('solvedProblems').aggregate([
    {
      $match: {
        userId: userId, // Using ObjectId for comparison
        solvedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$solvedAt' },
          week: { $week: '$solvedAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.week': 1 }
    }
  ]).toArray();

  return result.map(r => ({
    date: `Week ${r._id.week}, ${r._id.year}`,
    count: r.count
  }));
}

async function calculateMonthlyPerformance(db, userId, startDate) {
  const result = await db.collection('solvedProblems').aggregate([
    {
      $match: {
        userId: userId, // Using ObjectId for comparison
        solvedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$solvedAt' },
          month: { $month: '$solvedAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]).toArray();

  return result.map(r => ({
    date: `${r._id.year}-${r._id.month.toString().padStart(2, '0')}`,
    count: r.count
  }));
}

async function calculateTopicPerformance(db, userId, solvedProblems) {
  // Get all topics and their total problems
  const topics = await db.collection('problems').aggregate([
    {
      $group: {
        _id: '$topic',
        total: { $sum: 1 }
      }
    }
  ]).toArray();

  // Calculate solved problems per topic
  const topicStats = topics.map(topic => {
    const solved = solvedProblems.filter(p => 
      p.problemDetails?.topic && 
      p.problemDetails.topic.toLowerCase() === topic._id?.toLowerCase()
    ).length;

    return {
      name: topic._id || 'Uncategorized',
      total: topic.total,
      solved,
      score: topic.total > 0 ? Math.round((solved / topic.total) * 100) : 0
    };
  });

  // Sort topics by completion percentage
  const sortedTopics = [...topicStats].sort((a, b) => b.score - a.score);

  // Identify weaknesses (topics with less than 50% completion)
  const weaknesses = sortedTopics
    .filter(t => t.score < 50)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return {
    distribution: sortedTopics,
    performance: sortedTopics,
    weaknesses
  };
}

async function calculateDifficultyDistribution(db, userId) {
  // Get all problems grouped by difficulty
  const result = await db.collection('problems').aggregate([
    {
      $group: {
        _id: '$difficulty',
        total: { $sum: 1 }
      }
    }
  ]).toArray();

  const distribution = {
    easy: { total: 0, solved: 0 },
    medium: { total: 0, solved: 0 },
    hard: { total: 0, solved: 0 }
  };

  result.forEach(r => {
    const difficulty = r._id?.toLowerCase();
    if (difficulty && distribution[difficulty]) {
      distribution[difficulty].total = r.total;
    }
  });

  // Get solved problems count by difficulty
  const solvedCounts = await db.collection('solvedProblems').aggregate([
    {
      $match: { 
        userId: userId // Using ObjectId for comparison
      }
    },
    {
      $lookup: {
        from: 'problems',
        localField: 'problemId',
        foreignField: '_id',
        as: 'problem'
      }
    },
    {
      $unwind: {
        path: '$problem',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: { 
          $toLower: { 
            $ifNull: ['$problem.difficulty', 'unknown'] 
          }
        },
        count: { $sum: 1 }
      }
    }
  ]).toArray();

  solvedCounts.forEach(sc => {
    const difficulty = sc._id;
    if (difficulty && distribution[difficulty]) {
      distribution[difficulty].solved = sc.count;
    }
  });

  return distribution;
}

async function calculateTimeAnalysis(solvedProblems) {
  if (solvedProblems.length === 0) {
    return {
      averageByDifficulty: {},
      bestTime: { problem: '', time: 0 },
      worstTime: { problem: '', time: 0 }
    };
  }

  // Filter out problems with invalid timeSpent
  const validProblems = solvedProblems.filter(p => p.timeSpent && p.timeSpent > 0);

  if (validProblems.length === 0) {
    return {
      averageByDifficulty: {},
      bestTime: { problem: '', time: 0 },
      worstTime: { problem: '', time: 0 }
    };
  }

  const timesByDifficulty = validProblems.reduce((acc, curr) => {
    const difficulty = curr.problemDetails?.difficulty?.toLowerCase() || 'unknown';
    if (!acc[difficulty]) {
      acc[difficulty] = { total: 0, count: 0 };
    }
    acc[difficulty].total += curr.timeSpent;
    acc[difficulty].count += 1;
    return acc;
  }, {});

  const averageByDifficulty = Object.entries(timesByDifficulty).reduce((acc, [difficulty, stats]) => {
    acc[difficulty] = Math.round(stats.total / stats.count);
    return acc;
  }, {});

  const sortedByTime = [...validProblems].sort((a, b) => a.timeSpent - b.timeSpent);

  return {
    averageByDifficulty,
    bestTime: {
      problem: sortedByTime[0].problemDetails?.title || 'Unknown Problem',
      time: sortedByTime[0].timeSpent
    },
    worstTime: {
      problem: sortedByTime[sortedByTime.length - 1].problemDetails?.title || 'Unknown Problem',
      time: sortedByTime[sortedByTime.length - 1].timeSpent
    }
  };
}

function generateRecommendations(topics, difficulty, timeAnalysis) {
  const recommendations = [];

  // Topic-based recommendations
  topics.weaknesses.forEach(topic => {
    recommendations.push({
      title: `Focus on ${topic.name}`,
      description: `Your performance in ${topic.name} is below 50%. Try solving more problems in this topic.`
    });
  });

  // Difficulty-based recommendations
  Object.entries(difficulty).forEach(([level, stats]) => {
    const percentage = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
    if (percentage < 30) {
      recommendations.push({
        title: `Improve ${level} problems`,
        description: `You've only solved ${Math.round(percentage)}% of ${level} problems. Try to solve more ${level} problems to build a strong foundation.`
      });
    }
  });

  // Time-based recommendations
  if (timeAnalysis.bestTime.time && timeAnalysis.worstTime.time && 
      timeAnalysis.bestTime.time < timeAnalysis.worstTime.time * 0.5) {
    recommendations.push({
      title: 'Consistency in solving time',
      description: 'There is a large variation in your solving times. Try to maintain a more consistent pace.'
    });
  }

  return recommendations;
} 