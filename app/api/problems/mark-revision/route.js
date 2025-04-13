
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
    
    await db.collection('revisionProblems').updateOne(
      { userId: payload.userId, problemId: new ObjectId(problemId) },
      { 
        $set: { 
          userId: payload.userId,
          problemId: new ObjectId(problemId),
          markedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ message: 'Problem marked for revision' });
  } catch (error) {
    console.error('Error marking problem for revision:', error);
    return NextResponse.json(
      { message: 'Error marking problem for revision' },
      { status: 500 }
    );
  }
}
