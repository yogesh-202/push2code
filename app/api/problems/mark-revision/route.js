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
    
    // Check if problem exists in either problems or sqlProblems collection
    const problem = await db.collection('problems').findOne({ _id: new ObjectId(problemId) }) ||
                   await db.collection('sqlProblems').findOne({ _id: new ObjectId(problemId) });
    
    if (!problem) {
      return NextResponse.json(
        { message: 'Problem not found' },
        { status: 404 }
      );
    }
    
    // Check if problem is already marked for revision
    const existingMark = await db.collection('revisionProblems').findOne({
      userId: payload.userId,
      problemId: new ObjectId(problemId)
    });

    if (existingMark) {
      // Remove from revision if already marked
      await db.collection('revisionProblems').deleteOne({
        userId: payload.userId,
        problemId: new ObjectId(problemId)
      });
      return NextResponse.json({ 
        message: 'Problem removed from revision',
        markedForRevision: false
      });
    } else {
      // Add to revision if not marked
      await db.collection('revisionProblems').insertOne({
        userId: payload.userId,
        problemId: new ObjectId(problemId),
        markedAt: new Date()
      });
      return NextResponse.json({ 
        message: 'Problem marked for revision',
        markedForRevision: true
      });
    }
  } catch (error) {
    console.error('Error marking problem for revision:', error);
    return NextResponse.json(
      { message: 'Error marking problem for revision' },
      { status: 500 }
    );
  }
}
