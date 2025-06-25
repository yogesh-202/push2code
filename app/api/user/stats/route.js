import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserProblemStatus from '@/models/problem_status.model';
import Problem from '@/models/problem.model';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const userId = new ObjectId(session.user.id);

    // Fetch attempted and solved
    const [attemptedCount, solvedCount, stats, allProblems] = await Promise.all([
      UserProblemStatus.countDocuments({ userId }),
      UserProblemStatus.countDocuments({ userId, isSolved: true }),
      UserProblemStatus.aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: 'problems',
            localField: 'problemId',
            foreignField: '_id',
            as: 'problem'
          }
        },
        { $unwind: '$problem' },
        {
          $facet: {
            difficultyProgress: [
              {
                $group: {
                  _id: '$problem.difficulty',
                  solved: {
                    $sum: {
                      $cond: ['$$ROOT.isSolved', 1, 0]
                    }
                  },
                  attempted: { $sum: 1 }
                }
              }
            ],
            topicProgress: [
              { $unwind: '$problem.tags' },
              {
                $group: {
                  _id: '$problem.tags',
                  solved: {
                    $sum: {
                      $cond: ['$$ROOT.isSolved', 1, 0]
                    }
                  },
                  attempted: { $sum: 1 }
                }
              }
            ],
            averageTime: [
              {
                $match: { isSolved: true }
              },
              {
                $group: {
                  _id: null,
                  avgTime: { $avg: '$timespent' },
                  totalTime: { $sum: '$timespent' }
                }
              }
            ],
            streakData: [
              {
                $match: { isSolved: true }
              },
              {
                $group: {
                  _id: {
                    $dateToString: { format: '%Y-%m-%d', date: '$solvedAt' }
                  },
                  count: { $sum: 1 }
                }
              },
              { $sort: { _id: 1 } }
            ]
          }
        }
      ]),
      Problem.find({}, { difficulty: 1, tags: 1 }).lean()
    ]);
  
    
    const {
      difficultyProgress = [],
      topicProgress = [],
      averageTime = [],
      streakData = []
    } = stats[0];

    // Create difficulty totals
    const difficultyTotals = allProblems.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {});

    const topicTotals = allProblems.reduce((acc, p) => {
      for (const tag of p.tags || []) {
        acc[tag] = (acc[tag] || 0) + 1;
      }
      return acc;
    }, {});

    const formattedDifficultyProgress = {};
    for (const entry of difficultyProgress) {
      formattedDifficultyProgress[entry._id] = {
        solved: entry.solved,
        attempted: entry.attempted,
        total: difficultyTotals[entry._id] || 0
      };
    }

   const seenTopics = new Set();
const formattedTopicProgress = topicProgress
  .filter(t => t._id && typeof t._id === 'string' && t._id.trim() !== '')
  .map(t => ({
    topic: t._id.trim().toLowerCase(), // normalize for uniqueness
    solved: t.solved,
    attempted: t.attempted,
    total: topicTotals[t._id] || 0
  }))
  .filter(t => {
    if (seenTopics.has(t.topic)) return false;
    seenTopics.add(t.topic);
    return true;
  });

    // Calculate streak
    const dates = streakData.map(d => d._id).sort();
    let streak = 0;
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If no problems solved today, check if streak is broken
    const lastSolveDate = dates.length > 0 ? new Date(dates[dates.length - 1]) : null;
    const daysSinceLastSolve = lastSolveDate ? 
      Math.floor((today - lastSolveDate) / (1000 * 60 * 60 * 24)) : 
      Number.MAX_SAFE_INTEGER;

    // If it's been more than 1 day since last solve, streak is broken
    if (daysSinceLastSolve > 0) {
      streak = 0;
    } else {
      // Calculate streak by checking consecutive days
      for (let i = dates.length - 1; i >= 0; i--) {
        const currentDate = new Date(dates[i]);
        const prevDate = i > 0 ? new Date(dates[i - 1]) : null;
        
        // First day or consecutive with previous
        if (!prevDate || 
            (currentDate - prevDate) / (1000 * 60 * 60 * 24) === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
      streak = currentStreak;
    }

    // Format average time and total time
    const avgTimeMinutes = averageTime[0]?.avgTime || 0;
    const totalTimeMinutes = averageTime[0]?.totalTime || 0;
    
    return NextResponse.json({
      difficultyProgress: formattedDifficultyProgress,
      topicProgress: formattedTopicProgress.sort((a, b) => b.solved - a.solved), // Sort by most solved
      totalSolved: solvedCount,
      totalAttempted: attemptedCount,
      totalAvailable: allProblems.length,
      accuracy:
        attemptedCount > 0
          ? parseFloat(((solvedCount / attemptedCount) * 100).toFixed(1))
          : 0,
      avgTimePerProblem: Math.round(avgTimeMinutes), // Round to nearest minute
      totalTimeSpent: Math.round(totalTimeMinutes),
      streak,
      lastSolvedDate: dates[0] || null
    });
  } catch (err) {
    console.error('Error in GET /api/stats:', err);
    return Response.json({ message: 'Failed to fetch stats' }, { status: 500 });
  }
}
