import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
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

    // Connect to database
    const { db } = await connectToDatabase();

    // Get user from database
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.userId) });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get all SQL problems with their revision status
    const problems = await db.collection('sqlProblems').find({}).toArray();

    // Get user's solved problems
    const solvedProblems = await db.collection('solvedProblems')
      .find({ userId: user._id })
      .toArray();

    // Create a map of solved problems for quick lookup
    const solvedProblemsMap = new Map(
      solvedProblems.map(sp => [sp.problemId.toString(), sp])
    );

    // Format the response
    const formattedProblems = problems.map(problem => ({
      id: problem._id.toString(),
      title: problem.title,
      difficulty: problem.difficulty,
      tags: problem.tags || [],
      leetcodeId: problem.leetcodeId,
      leetcodeLink: problem.leetcodeLink,
      youtubeLink: problem.youtubeLink,
      solved: solvedProblemsMap.has(problem._id.toString()),
      solvedAt: solvedProblemsMap.get(problem._id.toString())?.solvedAt,
      markedForRevision: problem.revisionStatus || false
    }));

    return NextResponse.json(formattedProblems);
  } catch (error) {
    console.error('Error fetching SQL problems:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
