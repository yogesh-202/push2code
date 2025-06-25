import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SqlProblem from '@/models/sqlproblem.model';
import SqlProblemStatus from '@/models/sqlproblemstatus.model';
import User from '@/models/user.model';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { problemId, timeSpent, selfRatedDifficulty } = await req.json();

    if (!problemId || timeSpent === undefined || selfRatedDifficulty === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const solvedAt = new Date();
    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Find problem by ObjectId
    const problemObjId = mongoose.isValidObjectId(problemId) ? new mongoose.Types.ObjectId(problemId) : null;
    const problem = await SqlProblem.findOne(
      problemObjId ? { _id: problemObjId } : { id: problemId }
    );

    if (!problem) {
      return NextResponse.json({ message: 'SQL Problem not found' }, { status: 404 });
    }

    // Check if already solved
    const existingSolution = await SqlProblemStatus.findOne({
      userId: user._id,
      problemId: problem._id
    });

    if (existingSolution) {
      return NextResponse.json({ message: 'Problem already solved' }, { status: 400 });
    }

    // Save to solved SQL problems
    await SqlProblemStatus.create({
      userId: user._id,
      problemId: problem._id,
      solvedAt,
      timeSpent: parseInt(timeSpent),
      selfRatedDifficulty: parseInt(selfRatedDifficulty)
    });

    // Update the problem itself (optional if not required in your schema)
    await SqlProblem.findByIdAndUpdate(problem._id, {
      $set: {
        lastSolvedAt: solvedAt,
        timeSpent: parseInt(timeSpent),
        selfRatedDifficulty: parseInt(selfRatedDifficulty)
      }
    });

    // Update user stats
    await User.findByIdAndUpdate(user._id, {
      $inc: { totalSqlProblemsSolved: 1 },
      $set: { lastActive: solvedAt }
    });

    return NextResponse.json({
      message: 'SQL Problem marked as solved',
      solvedAt,
      problemId: problem._id
    }, { status: 200 });

  } catch (error) {
    console.error('Error marking SQL problem as solved:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
