import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    // Verify token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const { problemId, timeSpent, selfRatedDifficulty } = await request.json();
    
    if (!problemId || !timeSpent || !selfRatedDifficulty) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Check if problem exists
    const problem = await db.collection('problems').findOne({
      _id: new ObjectId(problemId),
    });
    
    if (!problem) {
      return NextResponse.json(
        { message: 'Problem not found' },
        { status: 404 }
      );
    }

    // Check if already solved
    const existingSolved = await db.collection('solvedProblems').findOne({
      userId: payload.userId,
      problemId: new ObjectId(problemId),
    });
    
    if (existingSolved) {
      return NextResponse.json(
        { message: 'Problem already marked as solved' },
        { status: 409 }
      );
    }

    // Mark problem as solved
    const now = new Date();
    const solvedProblem = {
      userId: payload.userId,
      problemId: new ObjectId(problemId),
      timeSpent: parseInt(timeSpent),
      selfRatedDifficulty,
      solvedAt: now,
    };
    
    await db.collection('solvedProblems').insertOne(solvedProblem);

    // Update user stats
    const updateResult = await db.collection('users').updateOne(
      { _id: new ObjectId(payload.userId) },
      { 
        $inc: { 'stats.totalSolved': 1, 'stats.timeSpent': parseInt(timeSpent) },
        $set: { 'stats.lastActive': now }
      }
    );
    
    // Update streak
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId) });
    const lastActive = user.stats.lastActive;
    const currentStreak = user.stats.streak || 0;
    
    // Calculate days between last active and now
    const lastActiveDate = new Date(lastActive);
    const dayDiff = Math.floor((now - lastActiveDate) / (1000 * 60 * 60 * 24));
    
    let newStreak = currentStreak;
    if (dayDiff === 0) {
      // Same day, no streak change
    } else if (dayDiff === 1) {
      // Next day, increment streak
      newStreak += 1;
      await db.collection('users').updateOne(
        { _id: new ObjectId(payload.userId) },
        { $set: { 'stats.streak': newStreak } }
      );
    } else {
      // More than one day, reset streak
      newStreak = 1;
      await db.collection('users').updateOne(
        { _id: new ObjectId(payload.userId) },
        { $set: { 'stats.streak': newStreak } }
      );
    }

    return NextResponse.json({
      message: 'Problem marked as solved',
      solvedAt: now,
      streak: newStreak,
    });
  } catch (error) {
    console.error('Error marking problem as solved:', error);
    return NextResponse.json(
      { message: 'Error marking problem as solved' },
      { status: 500 }
    );
  }
}
