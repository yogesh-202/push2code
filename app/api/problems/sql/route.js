import { connectDB } from '@/lib/db'; // Mongoose connection
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SqlProblem from '@/models/sqlproblem.model';
import SqlProblemStatus from '@/models/sqlproblemstatus.model';
import User from '@/models/user.model';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // ✅ Remove .toArray()
    const problems = await SqlProblem.find({});
    const solvedProblems = await SqlProblemStatus.find({ userId: user._id });

    const solvedProblemsMap = new Map(
      solvedProblems.map(sp => [sp.problemId.toString(), sp])
    );

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




