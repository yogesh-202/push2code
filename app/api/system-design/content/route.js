import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SdModule from '@/models/sdmodule.model';
import SdLecture from '@/models/sdlecture.model';
import SystemDesignProgress from "@/models/systemdesignprogress.model";
import User from '@/models/user.model';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user.id);
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get all modules ordered
    const modules = await SdModule.find({}).sort({ order: 1 });
    console.log('Fetched modules:', modules);

    if (!modules || modules.length === 0) {
      return NextResponse.json({
        modules: [],
        totalProgress: {
          completedLectures: 0,
          totalLectures: 0,
          progressPercentage: 0
        }
      });
    }

    // Get all lectures
    const lectures = await SdLecture.find({}).sort({ moduleNumber: 1, order: 1 });
    console.log('Fetched all lectures:', lectures);

    // Get user progress for all lectures
    const userProgress = await SystemDesignProgress.find({ userId });
    console.log('User progress:', userProgress);

    const progressMap = new Map(
      userProgress.map(p => [p.lectureId?.toString(), p])
    );

    // Format modules with their lectures
    const formattedModules = modules.map(module => {
      // Filter lectures for this specific module using moduleNumber
      const moduleLectures = lectures.filter(l => l.moduleNumber === module.moduleNumber);
      console.log(`Module ${module.moduleNumber} (${module.moduleName}) lectures:`, moduleLectures);

      return {
        moduleNumber: module.moduleNumber,
        moduleName: module.moduleName,
        duration: module.duration,
        description: module.description,
        lectures: moduleLectures.map(lecture => {
          const progress = progressMap.get(lecture._id.toString()) || {};
          return {
            id: lecture._id.toString(),
            title: lecture.title,
            duration: lecture.duration,
            videoId: lecture.videoId,
            description: lecture.description || '',
            order: lecture.order,
            completed: progress.completed || false,
            lastWatchedAt: progress.lastWatchedAt || null,
            watchDuration: progress.watchDuration ?? 0
          };
        }).sort((a, b) => a.order - b.order) // Sort lectures by order within each module
      };
    });

    // Calculate total progress
    const totalLectures = lectures.length;
    const completedLectures = userProgress.filter(p => p.completed).length;

    return NextResponse.json({
      modules: formattedModules,
      totalProgress: {
        completedLectures,
        totalLectures,
        progressPercentage: totalLectures > 0
          ? (completedLectures / totalLectures) * 100
          : 0
      }
    });

  } catch (error) {
    console.error('Error fetching system design content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course content', details: error.message },
      { status: 500 }
    );
  }
}
