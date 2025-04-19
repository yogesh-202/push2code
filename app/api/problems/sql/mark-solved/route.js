import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { problemId, timeSpent, selfRatedDifficulty } = await req.json();

    if (!problemId || timeSpent === undefined || selfRatedDifficulty === undefined) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { db } = await connectToDatabase();
    const solvedAt = new Date();

    // Check if problem exists in SQL problems collection
    let problem = null;
    let query = {};
    
    try {
      // Try to find by MongoDB ObjectId first
      query = { _id: new ObjectId(problemId) };
      problem = await db.collection('sqlProblems').findOne(query);
    } catch (e) {
      // If not a valid ObjectId, try by regular id
      problem = await db.collection('sqlProblems').findOne({ id: problemId });
    }

    if (!problem) {
      return new Response(JSON.stringify({ message: 'SQL Problem not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if already solved
    const existingSolution = await db.collection('solvedSqlProblems').findOne({
      userId: new ObjectId(payload.userId),
      problemId: problem._id || problem.id
    });

    if (existingSolution) {
      return new Response(JSON.stringify({ message: 'Problem already solved' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add to solved SQL problems
    await db.collection('solvedSqlProblems').insertOne({
      userId: new ObjectId(payload.userId),
      problemId: problem._id || problem.id,
      solvedAt,
      timeSpent: parseInt(timeSpent),
      selfRatedDifficulty: parseInt(selfRatedDifficulty)
    });

    // Update the problem's solved status in the SQL problems collection
    await db.collection('sqlProblems').updateOne(
      { _id: problem._id || { id: problem.id } },
      { 
        $set: { 
          solved: true,
          lastSolvedAt: solvedAt,
          timeSpent: parseInt(timeSpent),
          selfRatedDifficulty: parseInt(selfRatedDifficulty)
        } 
      }
    );

    // Update user stats for SQL problems
    await db.collection('users').updateOne(
      { _id: new ObjectId(payload.userId) },
      {
        $inc: { totalSqlProblemsSolved: 1 },
        $set: { lastActive: solvedAt }
      }
    );

    return new Response(JSON.stringify({
      message: 'SQL Problem marked as solved',
      solvedAt,
      problemId: problem._id || problem.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error marking SQL problem as solved:', error);
    return new Response(JSON.stringify({ message: 'Internal server error', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 