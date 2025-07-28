import { connectDB } from '@/lib/db'; // Mongoose connection
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Problem from '@/models/problem.model';
import  UserProblemStatus from '@/models/problem_status.model';
import { ObjectId } from 'mongodb';


// 🔒 Check Sunday lock
async function checkSundayLock(userId) {
  
  const userObjectId = new ObjectId(userId);
  const today = new Date();
  const isSunday = today.getDay() === 0;

  const revisionProblems = await UserProblemStatus.find({
    userId: userObjectId,
    setToRevision: true,
  });

  const backlogProblems = await UserProblemStatus.find({
    userId: userObjectId,
    setToBacklog: true,
  });

  const solvedSet = new Set(
    (await UserProblemStatus.find({ userId: userObjectId, isSolved: true }))
      .map(p => p.problemId.toString())
  );

  const allRevisionSolved = revisionProblems.every(p => solvedSet.has(p.problemId.toString()));
  const allBacklogSolved = backlogProblems.every(p => solvedSet.has(p.problemId.toString()));

  // Only lock if it's Sunday AND there are unsolved revision/backlog problems
  const shouldLock = isSunday && !(allRevisionSolved && allBacklogSolved);

  return {
    isLocked: shouldLock,
    isSunday,
    revisionCount: revisionProblems.length,
    backlogCount: backlogProblems.length,
    solvedRevisionCount: revisionProblems.filter(p => solvedSet.has(p.problemId.toString())).length,
    solvedBacklogCount: backlogProblems.filter(p => solvedSet.has(p.problemId.toString())).length,
  };
}

// 📦 API GET handler
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const userId = new ObjectId(session.user.id);
   
    const lockStatus = await checkSundayLock(userId);

    // Get all problems with their status
    const problems = await Problem.aggregate([
      {
        $lookup: {
          from: 'userproblemstatuses',
          let: { problemId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$problemId', '$$problemId'] },
                    { $eq: ['$userId', userId] }
                  ]
                }
              }
            }
          ],
          as: 'userStatus'
        }
      },
      {
        $addFields: {
          status: { $arrayElemAt: ['$userStatus', 0] },
          isSolved: {
            $ifNull: [{ $arrayElemAt: ['$userStatus.isSolved', 0] }, false]
          },
          setToRevision: {
            $ifNull: [{ $arrayElemAt: ['$userStatus.setToRevision', 0] }, false]
          },
          setToBacklog: {
            $ifNull: [{ $arrayElemAt: ['$userStatus.setToBacklog', 0] }, false]
          },
          setToDailyGoal: {
            $ifNull: [{ $arrayElemAt: ['$userStatus.setToDailyGoal', 0] }, false]
          },
          solvedAt: { 
            $arrayElemAt: ['$userStatus.solvedAt', 0] 
          },
          selfRatedDifficulty: { 
            $arrayElemAt: ['$userStatus.selfRatedDifficulty', 0] 
          },
          timespent: {
            $ifNull: [{ $arrayElemAt: ['$userStatus.timespent', 0] }, 0]
          }
        }
      },
      {
        $project: {
          userStatus: 0,
          status: 0
        }
      }
    ]);

    
    console.log('Problems fetched:', {
      total: problems.length,
      withRevisionTrue: problems.filter(p => p.setToRevision === true).length,
      withRevisionFalse: problems.filter(p => p.setToRevision === false).length,
      withBacklog: problems.filter(p => p.setToBacklog === true).length,
      solved: problems.filter(p => p.isSolved === true).length,
      sampleProblem: problems[0]
    });

    return NextResponse.json({ problems, lockStatus });

  } catch (error) {
    console.error('Error in GET /api/problems:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


  
