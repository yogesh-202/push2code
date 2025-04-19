import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    // Extract the token from the Authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Parse the request body to get the problemId
    const { problemId } = await request.json();
    if (!problemId) {
      return NextResponse.json({ message: 'Problem ID is required' }, { status: 400 });
    }

    // Connect to the database
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('Failed to connect to the database');
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if the problem is already in the user's daily goals for today
    const existingGoal = await db.collection('dailyGoals').findOne({
      userId: new ObjectId(payload.userId),
      problemId: new ObjectId(problemId),
      date: today
    });

    if (existingGoal) {
      return NextResponse.json({ message: 'Problem is already in daily goals' }, { status: 400 });
    }

    // Add the problem to the user's daily goals
    const result = await db.collection('dailyGoals').insertOne({
      userId: new ObjectId(payload.userId),
      problemId: new ObjectId(problemId),
      date: today,
      addedAt: new Date(),
      solved: false,
      timeSpent: null,
      selfRatedDifficulty: null,
      solvedAt: null
    });

    // Get the updated list of daily goals
    const problems = await db.collection('problems').find({}).toArray();
    const dailyGoals = await db.collection('dailyGoals')
      .find({ 
        userId: new ObjectId(payload.userId),
        date: today
      })
      .toArray();

    // Get user's solved problems
    const solvedProblems = await db.collection('solvedProblems')
      .find({
        userId: new ObjectId(payload.userId)
      })
      .toArray();

    // Create a Set of solved problem IDs for quick lookup
    const solvedProblemIds = new Set(
      solvedProblems.map(sp => sp.problemId.toString())
    );

    // Format the daily goals
    const formattedDailyGoals = dailyGoals
      .map(goal => {
        const problem = problems.find(p => p._id.toString() === goal.problemId.toString());
        if (!problem) return null;

        return {
          id: goal.problemId.toString(),
          title: problem.title,
          topic: problem.topic,
          difficulty: problem.difficulty,
          url: problem.url || problem.link,
          addedAt: goal.addedAt,
          solved: solvedProblemIds.has(goal.problemId.toString()),
          timeSpent: goal.timeSpent,
          selfRatedDifficulty: goal.selfRatedDifficulty,
          solvedAt: goal.solvedAt
        };
      })
      .filter(Boolean);

    return NextResponse.json({ 
      message: 'Problem added to daily goals', 
      dailyGoals: formattedDailyGoals 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding problem to daily goals:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

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

    // Connect to database
    const { db } = await connectToDatabase();

    // Get all problems
    const problems = await db.collection('problems').find({}).toArray();

    const today = new Date().toISOString().split('T')[0];

    // Get user's daily goals for today
    const dailyGoals = await db.collection('dailyGoals')
      .find({ 
        userId: new ObjectId(decoded.userId),
        date: today
      })
      .toArray();

    // Get user's solved problems
    const solvedProblems = await db.collection('solvedProblems')
      .find({
        userId: new ObjectId(decoded.userId)
      })
      .toArray();

    // Create a Set of solved problem IDs for quick lookup
    const solvedProblemIds = new Set(
      solvedProblems.map(sp => sp.problemId.toString())
    );

    // If no daily goals for today, check for unsolved problems from previous days
    if (dailyGoals.length === 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Get unsolved problems from yesterday
      const yesterdayGoals = await db.collection('dailyGoals')
        .find({ 
          userId: new ObjectId(decoded.userId),
          date: yesterdayStr,
          solved: false
        })
        .toArray();

      // Move unsolved problems to backlogs
      for (const goal of yesterdayGoals) {
        // Check if the problem is actually solved
        if (!solvedProblemIds.has(goal.problemId.toString())) {
          // Add to backlogs only if not solved
          await db.collection('backlogs').insertOne({
            userId: new ObjectId(decoded.userId),
            problemId: goal.problemId,
            addedAt: new Date(),
            originalDate: goal.date
          });
        }

        // Remove from daily goals
        await db.collection('dailyGoals').deleteOne({
          userId: new ObjectId(decoded.userId),
          problemId: goal.problemId,
          date: yesterdayStr
        });
      }
    }

    // Convert MongoDB daily goals to the format we need
    const formattedDailyGoals = dailyGoals
      .map(goal => {
        const problem = problems.find(p => p._id.toString() === goal.problemId.toString());
        if (!problem) return null;

        return {
          id: goal.problemId.toString(),
          title: problem.title,
          topic: problem.topic,
          difficulty: problem.difficulty,
          url: problem.url || problem.link,
          addedAt: goal.addedAt,
          solved: solvedProblemIds.has(goal.problemId.toString()),
          timeSpent: goal.timeSpent,
          selfRatedDifficulty: goal.selfRatedDifficulty,
          solvedAt: goal.solvedAt
        };
      })
      .filter(Boolean);

    return NextResponse.json({ dailyGoals: formattedDailyGoals });
  } catch (error) {
    console.error('Error fetching daily goals:', error);
    return NextResponse.json(
      { message: 'Error fetching daily goals' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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

    // Parse request body
    const { problemId, timeSpent, selfRatedDifficulty } = await request.json();

    if (!problemId || !timeSpent || !selfRatedDifficulty) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    const today = new Date().toISOString().split('T')[0];

    // Update the daily goal
    const result = await db.collection('dailyGoals').updateOne(
      {
        userId: new ObjectId(decoded.userId),
        problemId: new ObjectId(problemId),
        date: today
      },
      {
        $set: {
          solved: true,
          timeSpent,
          selfRatedDifficulty,
          solvedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Daily goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Daily goal updated successfully' });
  } catch (error) {
    console.error('Error updating daily goal:', error);
    return NextResponse.json(
      { message: 'Error updating daily goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Extract the token from the Authorization header
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Parse the request body to get the problemId
    const { problemId } = await request.json();
    if (!problemId) {
      return NextResponse.json({ message: 'Problem ID is required' }, { status: 400 });
    }

    // Connect to the database
    const { db } = await connectToDatabase();
    if (!db) {
      console.error('Failed to connect to the database');
      return NextResponse.json({ message: 'Database connection error' }, { status: 500 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Remove the problem from the user's daily goals
    const result = await db.collection('dailyGoals').deleteOne({
      userId: new ObjectId(payload.userId),
      problemId: new ObjectId(problemId),
      date: today
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Problem not found in daily goals' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Problem removed from daily goals' }, { status: 200 });
  } catch (error) {
    console.error('Error removing problem from daily goals:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
