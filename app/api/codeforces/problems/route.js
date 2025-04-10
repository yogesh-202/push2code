import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCuratedProblemList } from '@/utils/codeforcesApi';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
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
    
    // Connect to database to store problems if needed
    const { db } = await connectToDatabase();
    
    // Check if we already have cached problems
    const cachedProblems = await db.collection('cfProblems').find({}).toArray();
    
    if (cachedProblems.length > 0) {
      return NextResponse.json({
        problems: cachedProblems
      });
    }
    
    // If not cached, fetch from Codeforces API
    const problems = await getCuratedProblemList();
    
    if (problems.length > 0) {
      // Cache the problems in database
      await db.collection('cfProblems').insertMany(problems);
    }
    
    return NextResponse.json({
      problems
    });
  } catch (error) {
    console.error('Error fetching Codeforces problems:', error);
    return NextResponse.json(
      { message: 'Error fetching problems', error: error.message },
      { status: 500 }
    );
  }
}