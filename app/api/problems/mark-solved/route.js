import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import UserProblemStatus from '@/models/problem_status.model';
import Problem from '@/models/problem.model';
import User from '@/models/user.model';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { problemId, timeSpent, selfRatedDifficulty } = await req.json();
    if (!problemId || timeSpent === undefined || selfRatedDifficulty === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const userId = session.user.id;
    const solvedAt = new Date();

    // Validate problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json({ message: 'Problem not found' }, { status: 404 });
    }

    // Check if already marked as solved
    const existing = await UserProblemStatus.findOne({
      userId,
      problemId,
      isSolved: true
    });

    if (existing) {
      return NextResponse.json({ message: 'Already marked as solved' }, { status: 400 });
    }

    // Insert status
    await UserProblemStatus.updateOne(
      { userId, problemId },
      {
        $set: {
          isSolved: true,
          setToDailyGoal: false,
          setToBacklog: false,
          solvedAt: new Date(),
          timeSpent: parseInt(timeSpent),
          selfRatedDifficulty: (() => {
            switch(parseInt(selfRatedDifficulty)) {
              case 1: return 'Easy';
              case 2: return 'Medium';
              case 3: return 'Hard';
              default: return 'Easy';
            }
          })()
        }
      },
      { upsert: true }
    );
    // Update user stats (assumes User schema has stats object)
    await User.findByIdAndUpdate(userId, {
      $inc: {
        totalSolved: 1,
        'stats.timeSpent': parseInt(timeSpent)
      },
      $set: {
        'stats.lastSolvedAt': solvedAt,
        lastActive: solvedAt
      }
    });

    return NextResponse.json({
      message: 'Problem marked as solved',
      solvedAt,
      solved: true,
      problemId
    });

  } catch (err) {
    console.error(' Error marking problem as solved:', err);
    return NextResponse.json({ message: 'Internal server error', error: err.message }, { status: 500 });
  }
}
