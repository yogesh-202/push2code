import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

import SdLecture from '@/models/sdlecture.model';
import SystemDesignProgress from '@/models/systemdesignprogress.model';
import User from '@/models/user.model';

export async function POST(request) {
  try {
    // Authenticate user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { lectureId, completed, watchDuration } = await request.json();

    if (!lectureId) {
      return NextResponse.json(
        { error: 'Lecture ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // Update or insert progress
    await SystemDesignProgress.findOneAndUpdate(
      {
        userId: userId,
        lectureId: new mongoose.Types.ObjectId(lectureId)
      },
      {
        completed,
        watchDuration,
        lastWatchedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Compute progress stats using Mongoose
    const totalLectures = await SdLecture.countDocuments();
    const completedLectures = await SystemDesignProgress.countDocuments({
      userId: userId,
      completed: true
    });

    return NextResponse.json({
      success: true,
      totalProgress: {
        completedLectures,
        totalLectures,
        progressPercentage:
          totalLectures > 0
            ? (completedLectures / totalLectures) * 100
            : 0
      }
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
