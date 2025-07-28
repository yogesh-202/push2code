import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from "@/lib/db";
import UserProblemStatus from "@/models/problem_status.model";
import { ObjectId } from "mongodb";


const isToday = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return today.getFullYear() === year && 
           today.getMonth() + 1 === month && 
           today.getDate() === day;
};


const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await req.json();
    if (!problemId) {
      return NextResponse.json(
        { message: "Missing problemId" },
        { status: 400 }
      );
    }

    await connectDB();

    const userId = new ObjectId(session.user.id);
    const pid = new ObjectId(problemId);
    
    const todayString = getTodayString();
  
  
    const existing = await UserProblemStatus.findOne({
      userId,
      problemId: pid,
    });

    if (existing) {
      
      const updated = await UserProblemStatus.findOneAndUpdate(
        { userId, problemId: pid },
        {
          $set: {
            setToDailyGoal: !existing.setToDailyGoal,
            dailyGoalAssignedDate: !existing.setToDailyGoal ? todayString : null,
            setToBacklog: false,
          },
        },
        { new: true }
      );

      return NextResponse.json({
        message: updated.setToDailyGoal
          ? "Added to daily goals"
          : "Removed from daily goals",
        setToDailyGoal: updated.setToDailyGoal,
        dailyGoalAssignedDate: updated.dailyGoalAssignedDate,
      });
    } else {
    
      const newStatus = await UserProblemStatus.create({
        userId,
        problemId: pid,
        setToDailyGoal: true,
        dailyGoalAssignedDate: todayString,
        setToBacklog: false,
        selfRatedDifficulty: 'Easy'
      });

      return NextResponse.json({
        message: "Added to daily goals",
        setToDailyGoal: true,
        dailyGoalAssignedDate: todayString,
      });
    }
  } catch (err) {
    console.error("Error in POST /api/daily-goals:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = new ObjectId(session.user.id);
    
    const todayString = getTodayString();


    const allDailyGoals = await UserProblemStatus.find({
      userId,
      setToDailyGoal: true,
    });

    
    for (const goal of allDailyGoals) {
      if (goal.dailyGoalAssignedDate<todayString) {
        await UserProblemStatus.updateOne(
          { _id: goal._id },
          {
            $set: {
              setToDailyGoal: false,
              setToBacklog: true,
            },
            $unset: {
              dailyGoalAssignedDate: "",
            },
          }
        );
      }
    }



    // Fetch remaining daily goals (only today's)
    const dailyGoals = await UserProblemStatus.aggregate([
      {
        $match: {
          userId: new ObjectId(session.user.id),
          setToDailyGoal: true,
        },
      },
      {
        $lookup: {
          from: "problems",
          localField: "problemId",
          foreignField: "_id",
          as: "problem",
        },
      },
      { $unwind: "$problem" },
    ]);


    const formatted = dailyGoals.map((goal) => ({
      id: goal.problem._id.toString(),
      title: goal.problem.title,
      topic: goal.problem.topic,
      difficulty: goal.problem.difficulty,
      url: goal.problem.leetcodeLink,
      link: goal.problem.leetcodeLink,
      dailyGoalAssignedDate: goal.dailyGoalAssignedDate,
      setToRevision: goal.setToRevision || false,
      setToBacklog: goal.setToBacklog || false,
      youtubelink: goal.problem.youtubeLink,
      setToDailyGoal: goal.setToDailyGoal || false,
      addedAt: goal.addedAt || goal.createdAt || null,
      solved: goal.isSolved || false,
      timeSpent: goal.timespent || 0,
      selfRatedDifficulty: goal.selfRatedDifficulty,
      solvedAt: goal.solvedAt || null,
      isSolved: goal.isSolved || false,
    }));
    


    return NextResponse.json({ 
      dailyGoals: formatted,
      message: "Daily goals fetched successfully"
    });
  } catch (err) {
    console.error("Error in GET /api/daily-goals:", err);
    return NextResponse.json(
      { 
        message: "Error fetching daily goals",
        error: err.message 
      },
      { status: 500 }
    );
  }
}
