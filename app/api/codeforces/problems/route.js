import { NextResponse } from 'next/server';
import { getCuratedProblemList } from '@/utils/codeforcesApi';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    // Get the curated problem list
    const { success, problems, error } = await getCuratedProblemList();
    
    if (!success) {
      return NextResponse.json(
        { error },
        { status: 500 }
      );
    }

    // Transform the problems into a more convenient format
    const formattedProblems = problems.map(problem => ({
      id: `${problem.contestId}${problem.index}`,
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      type: problem.type,
      rating: problem.rating,
      tags: problem.tags,
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