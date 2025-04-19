const { connectToDatabase } = require('../lib/mongodb');
const { ObjectId } = require('mongodb');

async function insertSystemDesignContent() {
  try {
    const { db } = await connectToDatabase();

    // Insert modules
    const modules = [
      {
        moduleNumber: 1,
        moduleName: "Introduction to System Design",
        duration: "2 hours",
        description: "Learn the fundamentals of system design",
        order: 1
      },
      {
        moduleNumber: 2,
        moduleName: "Scalability and Performance",
        duration: "3 hours",
        description: "Understanding scalability patterns and performance optimization",
        order: 2
      }
    ];

    const insertedModules = await db.collection('systemDesignModules').insertMany(modules);
    console.log('Modules inserted:', insertedModules.insertedCount);

    // Get the inserted module IDs
    const moduleIds = Object.values(insertedModules.insertedIds);

    // Insert lectures for each module
    const lectures = [
      // Module 1 lectures
      {
        moduleId: moduleIds[0],
        title: "Introduction to System Design Course",
        duration: "05:30",
        videoId: "your-video-id-1",
        order: 1,
        description: "Overview of the course and system design basics"
      },
      {
        moduleId: moduleIds[0],
        title: "System Design Fundamentals",
        duration: "08:45",
        videoId: "your-video-id-2",
        order: 2,
        description: "Core concepts and principles of system design"
      },
      // Module 2 lectures
      {
        moduleId: moduleIds[1],
        title: "Scalability Patterns",
        duration: "10:20",
        videoId: "your-video-id-3",
        order: 1,
        description: "Common patterns for building scalable systems"
      },
      {
        moduleId: moduleIds[1],
        title: "Performance Optimization",
        duration: "07:15",
        videoId: "your-video-id-4",
        order: 2,
        description: "Techniques for optimizing system performance"
      }
    ];

    const insertedLectures = await db.collection('systemDesignLectures').insertMany(lectures);
    console.log('Lectures inserted:', insertedLectures.insertedCount);

    console.log('System design content inserted successfully');
  } catch (error) {
    console.error('Error inserting system design content:', error);
  }
}

insertSystemDesignContent(); 