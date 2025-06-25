import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import cfproblem from '@/models/cf_problem.model';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rating = parseInt(searchParams.get('rating') || '1500', 10);

    await connectDB();

    const problems = await cfproblem.find({ });

    const formattedProblems = problems.map(problem => ({
      id: `${problem.contestId}${problem.index}${problem._id.toString()}`,
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      type: problem.type,
      rating: problem.rating,
      tags: problem.tags,
      solvedCount: 0,
      url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
    }));

    return NextResponse.json({ problems: formattedProblems });
  } catch (error) {
    console.error('Error fetching Codeforces problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem list' },
      { status: 500 }
    );
  }
}
