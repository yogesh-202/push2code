import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Validate token
    const token = request.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Get all problems
    const problems = await db.collection('problems').find({}).toArray();

    // Get user's backlogs
    const backlogs = await db.collection('backlogs')
      .find({ userId: decoded.userId })
      .sort({ addedAt: -1 })
      .toArray();

    // Convert MongoDB backlogs to the format we need
    const formattedBacklogs = backlogs.map(backlog => {
      const problem = problems.find(p => p._id.toString() === backlog.problemId);
      if (!problem) return null;

      return {
        id: backlog.problemId,
        title: problem.title,
        topic: problem.topic,
        difficulty: problem.difficulty,
        url: problem.url || problem.link,
        addedAt: backlog.addedAt,
        originalDate: backlog.originalDate
      };
    }).filter(Boolean); // Remove null entries

    return NextResponse.json({ backlogs: formattedBacklogs });
  } catch (error) {
    console.error('Error fetching backlogs:', error);
    return NextResponse.json(
      { message: 'Error fetching backlogs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Validate token
    const token = request.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { problemId, originalDate } = await request.json();

    if (!problemId) {
      return NextResponse.json(
        { message: 'Problem ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if problem is already in backlogs
    const existingBacklog = await db.collection('backlogs').findOne({
      userId: decoded.userId,
      problemId
    });

    if (existingBacklog) {
      return NextResponse.json(
        { message: 'Problem is already in backlogs' },
        { status: 400 }
      );
    }

    // Add to backlogs
    await db.collection('backlogs').insertOne({
      userId: decoded.userId,
      problemId,
      addedAt: new Date(),
      originalDate: originalDate || new Date()
    });

    return NextResponse.json({ message: 'Problem added to backlogs' });
  } catch (error) {
    console.error('Error adding to backlogs:', error);
    return NextResponse.json(
      { message: 'Error adding to backlogs' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Validate token
    const token = request.headers.get('authorization')?.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { problemId } = await request.json();

    if (!problemId) {
      return NextResponse.json(
        { message: 'Problem ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Remove from backlogs
    const result = await db.collection('backlogs').deleteOne({
      userId: decoded.userId,
      problemId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Problem not found in backlogs' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Problem removed from backlogs' });
  } catch (error) {
    console.error('Error removing from backlogs:', error);
    return NextResponse.json(
      { message: 'Error removing from backlogs' },
      { status: 500 }
    );
  }
} 