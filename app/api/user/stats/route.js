import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Verify token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      console.error('No token provided');
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      console.error('Invalid token or missing userId');
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('Failed to connect to database');
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Get user with proper ObjectId
    let userId;
    try {
      userId = new ObjectId(payload.userId);
    } catch (error) {
      console.error('Invalid userId format:', payload.userId);
      return NextResponse.json(
        { message: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const user = await db.collection('users').findOne({ _id: userId });
    if (!user) {
      console.error('User not found:', payload.userId);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get solved problems with proper aggregation
    const solvedProblems = await db.collection('solvedProblems')
      .aggregate([
        {
          $match: { 
            userId: payload.userId
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
          $sort: { solvedAt: -1 }
        }
      ]).toArray();

    // Calculate difficulty counts
    const difficultyCounts = await db.collection('solvedProblems').aggregate([
      {
        $match: { userId: payload.userId }
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
        $unwind: '$problem'
      },
      {
        $group: {
          _id: '$problem.difficulty',
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // Convert difficulty counts
    const difficultyMap = difficultyCounts.reduce((acc, curr) => {
      acc[curr._id.toLowerCase() + 'Count'] = curr.count;
      return acc;
    }, { easyCount: 0, mediumCount: 0, hardCount: 0 });

    // Calculate topic progress
    const topicProgress = await db.collection('problems').aggregate([
      {
        $group: {
          _id: '$topic',
          total: { $sum: 1 },
          problems: { $push: '$_id' }
        }
      },
      {
        $lookup: {
          from: 'solvedProblems',
          let: { problemIds: '$problems' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$problemId', '$$problemIds'] },
                    { $eq: ['$userId', payload.userId] }
                  ]
                }
              }
            }
          ],
          as: 'solved'
        }
      },
      {
        $project: {
          name: '$_id',
          total: 1,
          solved: { $size: '$solved' }
        }
      }
    ]).toArray();

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const hasSubmissionToday = await db.collection('solvedProblems').findOne({
      userId: payload.userId,
      solvedAt: { $gte: today }
    });

    const hasSubmissionYesterday = await db.collection('solvedProblems').findOne({
      userId: payload.userId,
      solvedAt: { 
        $gte: yesterday,
        $lt: today
      }
    });

    let streak = 0;
    if (hasSubmissionToday) {
      streak = 1;
      let checkDate = yesterday;
      
      while (true) {
        const submission = await db.collection('solvedProblems').findOne({
          userId: payload.userId,
          solvedAt: {
            $gte: checkDate,
            $lt: new Date(checkDate.getTime() + 24 * 60 * 60 * 1000)
          }
        });
        
        if (!submission) break;
        
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else if (hasSubmissionYesterday) {
      streak = 1;
      let checkDate = new Date(yesterday);
      checkDate.setDate(checkDate.getDate() - 1);
      
      while (true) {
        const submission = await db.collection('solvedProblems').findOne({
          userId: payload.userId,
          solvedAt: {
            $gte: checkDate,
            $lt: new Date(checkDate.getTime() + 24 * 60 * 60 * 1000)
          }
        });
        
        if (!submission) break;
        
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // Calculate total time spent
    const timeSpentResult = await db.collection('solvedProblems').aggregate([
      {
        $match: { userId: payload.userId }
      },
      {
        $group: {
          _id: null,
          totalTimeSpent: { $sum: '$timeSpent' }
        }
      }
    ]).toArray();

    const totalTimeSpent = timeSpentResult[0]?.totalTimeSpent || 0;

    // Get recently solved problems
    const recentlySolved = solvedProblems.slice(0, 5).map(sp => ({
      id: sp.problemId.toString(),
      title: sp.problemDetails[0]?.title || 'Unknown Problem',
      difficulty: sp.problemDetails[0]?.difficulty || 'Unknown',
      topic: sp.problemDetails[0]?.topic || 'Unknown',
      timeSpent: sp.timeSpent,
      solvedAt: sp.solvedAt,
    }));

    // Compile stats
    const stats = {
      totalSolved: solvedProblems.length,
      ...difficultyMap,
      timeSpent: totalTimeSpent,
      streak,
      joinedDate: user.createdAt,
      topicProgress,
      recentlySolved,
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in stats route:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching user stats',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
