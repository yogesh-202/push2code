import { NextResponse } from 'next/server';

async function fetchUserSubmissions(handle) {
  try {
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error('Failed to fetch submissions from Codeforces');
    }
    
    // Filter only accepted submissions and create a set of problem IDs
    const solvedProblems = new Set();
    data.result.forEach(submission => {
      if (submission.verdict === 'OK') {
        const problemId = `${submission.problem.contestId}${submission.problem.index}`;
        solvedProblems.add(problemId);
      }
    });
    
    return Array.from(solvedProblems);
  } catch (error) {
    console.error('Error fetching Codeforces submissions:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');
    
    if (!handle) {
      return NextResponse.json({ error: 'Codeforces handle is required' }, { status: 400 });
    }
    
    const solvedProblems = await fetchUserSubmissions(handle);
    
    return NextResponse.json({
      solvedProblems,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in sync-solved API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync solved problems' },
      { status: 500 }
    );
  }
} 