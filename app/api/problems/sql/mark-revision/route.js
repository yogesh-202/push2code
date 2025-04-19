import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { problemId } = await request.json();
    
    const { db } = await connectToDatabase();
    
    // Get the current problem
    const problem = await db.collection('sqlProblems').findOne({ _id: new ObjectId(problemId) });
    
    if (!problem) {
      return NextResponse.json(
        { message: 'SQL problem not found' },
        { status: 404 }
      );
    }

    // Toggle the revision status
    const newRevisionStatus = !problem.revisionStatus;
    
    // Update the problem's revision status
    await db.collection('sqlProblems').updateOne(
      { _id: new ObjectId(problemId) },
      { $set: { revisionStatus: newRevisionStatus } }
    );

    return NextResponse.json({ 
      message: newRevisionStatus ? 'Problem marked for revision' : 'Problem removed from revision',
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