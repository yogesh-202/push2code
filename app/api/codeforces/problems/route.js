import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rating = searchParams.get('rating') || 1500;
    
    const { db } = await connectToDatabase();
    
    // Get problems from MongoDB
    const problems = await db.collection('codeforcesProblems')
      .find({})
      .toArray();
    
    // Format problems to match the expected structure
    const formattedProblems = problems.map(problem => ({
      id: `${problem.contestId}${problem.index}${problem._id.toString()}`,
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      type: problem.type,
      rating: problem.rating,
      tags: problem.tags,
      solvedCount: 0, // We'll add this later if needed
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