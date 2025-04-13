import { NextResponse } from 'next/server';
import { getProblemSet } from '@/utils/codeforcesApi';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userRating = parseInt(searchParams.get('rating')) || 1500;

    const { success, problems, error } = await getProblemSet();

    if (!success) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Filter problems with ratings
    const ratedProblems = problems.filter(p => p.rating);

    // Get one problem from each difficulty range
    const dailyProblems = {
      easier: getRandomProblem(ratedProblems.filter(p => 
        p.rating >= userRating - 200 && p.rating < userRating - 100)),
      onLevel: getRandomProblem(ratedProblems.filter(p => 
        p.rating >= userRating - 100 && p.rating <= userRating + 100)),
      harder: getRandomProblem(ratedProblems.filter(p => 
        p.rating > userRating + 100 && p.rating <= userRating + 200))
    };

    return NextResponse.json({ dailyProblems });
  } catch (error) {
    console.error('Error fetching daily practice problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily practice problems' },
      { status: 500 }
    );
  }
}

function getRandomProblem(problems) {
  if (!problems.length) return null;
  const problem = problems[Math.floor(Math.random() * problems.length)];
  return {
    id: `${problem.contestId}${problem.index}`,
    contestId: problem.contestId,
    index: problem.index,
    name: problem.name,
    rating: problem.rating,
    tags: problem.tags,
    url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
  };
}