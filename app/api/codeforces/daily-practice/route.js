import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDailyCodeforcesProblems } from '@/utils/problemOrganizer';
import { getProblemSet } from '@/utils/codeforcesApi';

export async function GET(request) {
  try {
    // Get user's CF handle from query parameters
    const { searchParams } = new URL(request.url);
    const cfHandle = searchParams.get('handle');
    
    if (!cfHandle) {
      return NextResponse.json(
        { error: 'Codeforces handle is required' },
        { status: 400 }
      );
    }
    
    // Fetch user profile to get rating
    const profileResponse = await fetch(`${request.nextUrl.origin}/api/codeforces/profile?handle=${cfHandle}`);
    
    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 404 }
      );
    }
    
    const profileData = await profileResponse.json();
    const userRating = profileData.user?.rating || 1500; // Default to 1500 if no rating
    
    // Fetch problems from Codeforces
    const { success, problems, error } = await getProblemSet();
    
    if (!success) {
      return NextResponse.json(
        { error },
        { status: 500 }
      );
    }
    
    // Get user's solved problems from localStorage or another source
    // For this API, we'll use a parameter to pass solved problems
    const solvedProblemsParam = searchParams.get('solved');
    const solvedProblems = new Set(solvedProblemsParam ? solvedProblemsParam.split(',') : []);
    
    // Format problems for the organizer
    const formattedProblems = problems.map(problem => ({
      id: `${problem.contestId}${problem.index}`,
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      rating: problem.rating,
      tags: problem.tags,
      url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`
    }));
    
    // Get daily practice problems
    const dailyProblems = getDailyCodeforcesProblems(
      formattedProblems,
      userRating,
      solvedProblems
    );
    
    return NextResponse.json({ 
      userRating,
      dailyProblems 
    });
  } catch (error) {
    console.error('Error fetching daily practice problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily practice problems' },
      { status: 500 }
    );
  }
}