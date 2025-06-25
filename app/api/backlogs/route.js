import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import UserProblemStatus from '@/models/problem_status.model';
import { ObjectId } from 'mongodb';

// Helper function to check if a date string matches today
const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return today.getFullYear() === year && 
           today.getMonth() + 1 === month && 
           today.getDate() === day;
};

// Helper function to get today's date string
const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = new ObjectId(session.user.id);
    
    const todayString = getTodayString();

    // Get all daily goals
    const allDailyGoals = await UserProblemStatus.find({
      userId,
      setToDailyGoal: true,
    });


    // Process each goal to check if it should be moved to backlog
    for (const goal of allDailyGoals) {
      if (goal.dailyGoalAssignedDate<todayString) {
        await UserProblemStatus.updateOne(
          { _id: goal._id },
          {
            $set: {
              setToDailyGoal: false,
              setToBacklog: true
            },
            $unset: {
              dailyGoalAssignedDate: ''
            }
          }
        );
      }
    }
    



    // Fetch backlog problems
    const backlogProblems = await UserProblemStatus.aggregate([
      {
        $match: {
          userId,
          setToBacklog: true
        }
      },
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem'
        }
      },
      { $unwind: '$problem' }
    ]);

    // Format the response
    const formatted = backlogProblems.map(goal => ({
      id: goal.problem._id.toString(),
      title: goal.problem.title,
      topic: goal.problem.topic,
      difficulty: goal.problem.difficulty,
      url: goal.problem.leetcodeLink,
      youtubelink: goal.problem.youtubeLink,
      addedAt: goal.addedAt || goal.createdAt || null,
      dailyGoalAssignedDate: goal.dailyGoalAssignedDate,
      setToRevision: goal.setToRevision || false,
      setToBacklog: goal.setToBacklog || false,
      setToDailyGoal: goal.setToDailyGoal || false,
      solved: goal.isSolved || false,
      timeSpent: goal.timeSpent || 0,
      selfRatedDifficulty: goal.selfRatedDifficulty || null,
      solvedAt: goal.solvedAt || null
    }));

    return NextResponse.json({ backlogProblems: formatted });
  } catch (err) {
    console.error('Error in GET /api/backlogs:', err);
    return NextResponse.json({ message: 'Error fetching Backlogs' }, { status: 500 });
  }
}
