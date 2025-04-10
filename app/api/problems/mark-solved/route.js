import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
    const { problemId, timeSpent, difficulty, notes, solvedAt } = await request.json();
    
    if (!problemId) {
      return NextResponse.json(
        { message: 'Problem ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Check if problem exists
    let problem;
    try {
      problem = await db.collection('problems').findOne({
        _id: new ObjectId(problemId)
      });
    } catch (error) {
      // If problemId is not a valid ObjectId, try to find by string ID (for Codeforces problems)
      problem = await db.collection('problems').findOne({ id: problemId });
    }
    
    if (!problem) {
      return NextResponse.json(
        { message: 'Problem not found' },
        { status: 404 }
      );
    }
    
    // Check if user already solved this problem
    const existingSolve = await db.collection('solvedProblems').findOne({
      userId: decoded.userId,
      problemId: problemId
    });
    
    if (existingSolve) {
      // Update existing record
      await db.collection('solvedProblems').updateOne(
        { _id: existingSolve._id },
        { 
          $set: {
            timeSpent: timeSpent || existingSolve.timeSpent,
            difficulty: difficulty || existingSolve.difficulty,
            notes: notes || existingSolve.notes,
            solvedAt: solvedAt || existingSolve.solvedAt,
            updatedAt: new Date().toISOString()
          }
        }
      );
      
      return NextResponse.json({
        message: 'Problem solve record updated',
        updated: true
      });
    } else {
      // Create new solved problem record
      const solvedProblem = {
        userId: decoded.userId,
        problemId: problemId,
        timeSpent: timeSpent || 0,
        difficulty: difficulty || 3,
        notes: notes || '',
        solvedAt: solvedAt || new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      await db.collection('solvedProblems').insertOne(solvedProblem);
      
      return NextResponse.json({
        message: 'Problem marked as solved',
        created: true
      });
    }
  } catch (error) {
    console.error('Error marking problem as solved:', error);
    return NextResponse.json(
      { message: 'Error marking problem as solved' },
      { status: 500 }
    );
  }
}