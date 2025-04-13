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
    // Get user rating from query params
    const { searchParams } = new URL(request.url);
    const userRating = parseInt(searchParams.get('rating')) || 1500;

    // Filter and format problems
    const formattedProblems = problems
      .filter(problem => problem.rating && 
              Math.abs(problem.rating - userRating) <= 200)
      .map(problem => ({
        id: `${problem.contestId}${problem.index}`,
        contestId: problem.contestId,
        index: problem.index,
        name: problem.name,
        type: problem.type,
        rating: problem.rating,
        tags: problem.tags,
        url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
      }))
      .sort((a, b) => a.rating - b.rating);
    
    return NextResponse.json({ problems: formattedProblems });
  } catch (error) {
    console.error('Error fetching Codeforces problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem list' },
      { status: 500 }
    );
  }
}