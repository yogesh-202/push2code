import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    // Check authentication using JWT
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lectureId, completed, watchDuration } = await request.json();

    if (!lectureId) {
      return NextResponse.json(
        { error: 'Lecture ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Update or create progress record
    const result = await db.collection('osProgress').updateOne(
      {
        userId: payload.userId,
        lectureId: new ObjectId(lectureId)
      },
      {
        $set: {
          completed,
          watchDuration,
          lastWatchedAt: new Date()
        }
      },
      { upsert: true }
    );

    // Get updated progress statistics
    const totalLectures = await db.collection('osLectures').countDocuments();
    const completedLectures = await db.collection('osProgress').countDocuments({
      userId: payload.userId,
      completed: true
    });

    return NextResponse.json({
      success: true,
      totalProgress: {
        completedLectures,
        totalLectures,
        progressPercentage: (completedLectures / totalLectures) * 100
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