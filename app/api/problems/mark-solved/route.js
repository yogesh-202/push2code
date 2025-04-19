import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

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

    const { problemId, timeSpent, selfRatedDifficulty } = await request.json();

    if (!problemId || timeSpent === undefined || selfRatedDifficulty === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const solvedAt = new Date();
    const today = new Date().toISOString().split('T')[0];

    // Check if problem exists
    let query = {};
    try {
      query = { _id: new ObjectId(problemId) };
    } catch (e) {
      // If problemId is not a valid ObjectId, try using it as a regular id
      query = { id: problemId };
    }

    const problem = await db.collection('problems').findOne(query);
    if (!problem) {
      return NextResponse.json(
        { message: 'Problem not found' },
        { status: 404 }
      );
    }

    // Check if already solved
    const existingSolution = await db.collection('solvedProblems').findOne({
      userId: new ObjectId(payload.userId.toString()),
      problemId: problem._id
    });

    if (existingSolution) {
      return NextResponse.json(
        { message: 'Problem already solved' },
        { status: 400 }
      );
    }

    // Add to solved problems
    await db.collection('solvedProblems').insertOne({
      userId: new ObjectId(payload.userId.toString()),
      problemId: problem._id,
      solvedAt,
      timeSpent: parseInt(timeSpent),
      selfRatedDifficulty: parseInt(selfRatedDifficulty)
    });

    // Remove from daily goals if it exists there
    await db.collection('dailyGoals').deleteOne({
      userId: new ObjectId(payload.userId.toString()),
      problemId: problem._id,
      date: today
    });

    // Update user stats
    await db.collection('users').updateOne(
      { _id: new ObjectId(payload.userId.toString()) },
      {
        $inc: { 
          totalSolved: 1,
          'stats.timeSpent': parseInt(timeSpent)
        },
        $set: { 
          lastActive: solvedAt,
          'stats.lastSolvedAt': solvedAt
        }
      }
    );

    return NextResponse.json({
      message: 'Problem marked as solved',
      solvedAt,
      problemId: problem._id,
      solved: true
    });

  } catch (error) {
    console.error('Error marking problem as solved:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}