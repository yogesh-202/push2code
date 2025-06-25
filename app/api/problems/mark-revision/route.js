import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import UserProblemStatus from '@/models/problem_status.model';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { problemId } = await req.json();
    console.log('📝 Mark Revision API - Request:', { problemId, userId: session.user.id });
    
    if (!problemId) {
      return NextResponse.json({ message: 'Problem ID is required' }, { status: 400 });
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const problemObjectId = new mongoose.Types.ObjectId(problemId);

    // Find the current user problem status
    const existingStatus = await UserProblemStatus.findOne({
      userId,
      problemId: problemObjectId
    });
    
    console.log('📝 Mark Revision API - Found Status:', existingStatus);

    const result = await UserProblemStatus.findOneAndUpdate(
      { userId, problemId: problemObjectId },
      {
        $set: {
          userId,
          problemId: problemObjectId,
          setToRevision: existingStatus ? !existingStatus.setToRevision : true,
          isSolved: existingStatus ? existingStatus.isSolved : false,
          setToDailyGoal: existingStatus ? existingStatus.setToDailyGoal : false,
          setToBacklog: existingStatus ? existingStatus.setToBacklog : false,
          timespent: existingStatus ? existingStatus.timespent : 0
        }
      },
      { 
        new: true,
        upsert: true
      }
    );

    console.log('📝 Mark Revision API - Updated Status:', result);

    return NextResponse.json({ 
      message: result.setToRevision ? 'Marked for revision' : 'Removed from revision',
      setToRevision: result.setToRevision
    });

  } catch (error) {
    console.error('Error toggling revision status:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
