import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import SqlProblem from '@/models/sqlproblem.model';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { problemId } = await request.json();

    if (!problemId || !mongoose.isValidObjectId(problemId)) {
      return NextResponse.json(
        { message: 'Invalid problem ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const problem = await SqlProblem.findById(problemId);

    if (!problem) {
      return NextResponse.json(
        { message: 'SQL problem not found' },
        { status: 404 }
      );
    }

    const newRevisionStatus = !problem.revisionStatus;

    problem.revisionStatus = newRevisionStatus;
    await problem.save();

    return NextResponse.json({
      message: newRevisionStatus
        ? 'Problem marked for revision'
        : 'Problem removed from revision',
      markedForRevision: newRevisionStatus
    });

  } catch (error) {
    console.error('Error updating SQL problem revision status:', error);
    return NextResponse.json(
      { message: 'Error updating SQL problem revision status' },
      { status: 500 }
    );
  }
}
