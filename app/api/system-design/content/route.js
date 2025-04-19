import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Check authentication using JWT
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Fetch all modules ordered by their order field
    const modules = await db.collection('systemDesignModules')
      .find({})
      .sort({ order: 1 })
      .toArray();

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

    // Create a map of module numbers to their IDs
    const moduleMap = new Map(
      modules.map((module, index) => [`moduleIds[${index}]`, module._id])
    );

    // Get all lectures for these modules
    const lectures = await db.collection('systemDesignLectures')
      .find({})
      .sort({ order: 1 })
      .toArray();

    console.log('Fetched lectures:', lectures);

    // Get user's progress for all lectures
    const userProgress = await db.collection('systemDesignProgress')
      .find({
        userId: payload.userId
      })
      .toArray();

    // Create a map of lecture progress for quick lookup
    const progressMap = new Map(
      userProgress.map(progress => [progress.lectureId?.toString(), progress])
    );

    // Format the response
    const formattedModules = modules.map((module, index) => {
      const moduleIdString = `moduleIds[${index}]`;
      const moduleLectures = lectures.filter(
        lecture => lecture.moduleId === moduleIdString
      );
      
      console.log(`Lectures for module ${module.moduleNumber}:`, moduleLectures);
      
      return {
        moduleNumber: module.moduleNumber,
        moduleName: module.moduleName,
        duration: module.duration,
        description: module.description,
        lectures: moduleLectures.map(lecture => ({
          id: lecture._id?.toString(),
          title: lecture.title,
          duration: lecture.duration,
          videoId: lecture.videoId,
          description: lecture.description,
          completed: progressMap.get(lecture._id?.toString())?.completed || false,
          lastWatchedAt: progressMap.get(lecture._id?.toString())?.lastWatchedAt || null,
          watchDuration: progressMap.get(lecture._id?.toString())?.watchDuration || 0
        }))
      };
    });

    return NextResponse.json({
      modules: formattedModules,
      totalProgress: {
        completedLectures: userProgress.filter(p => p.completed).length,
        totalLectures: lectures.length,
        progressPercentage: lectures.length > 0 
          ? (userProgress.filter(p => p.completed).length / lectures.length) * 100 
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