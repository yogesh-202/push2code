const { connectToDatabase } = require('../lib/mongodb');
const { ObjectId } = require('mongodb');

async function insertComputerNetworksContent() {
  try {
    const { db } = await connectToDatabase();

    // Insert modules
    const modules = [
      {
        moduleNumber: 1,
        moduleName: "Introduction to Computer Networks",
        duration: "2 hours",
        description: "Learn the fundamentals of computer networks",
        order: 1
      },
      {
        moduleNumber: 2,
        moduleName: "OSI Model",
        duration: "3 hours",
        description: "Understanding the OSI model and its layers",
        order: 2
      },
      {
        moduleNumber: 3,
        moduleName: "TCP/IP Protocol Suite",
        duration: "2.5 hours",
        description: "Deep dive into TCP/IP protocols",
        order: 3
      }
    ];

    const insertedModules = await db.collection('computerNetworksModules').insertMany(modules);
    console.log('Modules inserted:', insertedModules.insertedCount);

    // Get the inserted module IDs
    const moduleIds = Object.values(insertedModules.insertedIds);

    // Insert lectures for each module
    const lectures = [
      // Module 1 lectures
      {
        moduleId: moduleIds[0],
        title: "What are Computer Networks?",
        duration: "15 min",
        videoId: "YOUTUBE_VIDEO_ID_1",
        order: 1,
        description: "Introduction to computer networks and their importance"
      },
      {
        moduleId: moduleIds[0],
        title: "Types of Computer Networks",
        duration: "20 min",
        videoId: "YOUTUBE_VIDEO_ID_2",
        order: 2,
        description: "Different types of networks: LAN, WAN, MAN"
      },
      {
        moduleId: moduleIds[0],
        title: "Network Topologies",
        duration: "25 min",
        videoId: "YOUTUBE_VIDEO_ID_3",
        order: 3,
        description: "Various network topologies and their characteristics"
      },
      // Module 2 lectures
      {
        moduleId: moduleIds[1],
        title: "Understanding the OSI Model",
        duration: "30 min",
        videoId: "YOUTUBE_VIDEO_ID_4",
        order: 1,
        description: "Overview of the OSI model and its purpose"
      },
      {
        moduleId: moduleIds[1],
        title: "Physical Layer",
        duration: "25 min",
        videoId: "YOUTUBE_VIDEO_ID_5",
        order: 2,
        description: "Physical layer protocols and standards"
      },
      {
        moduleId: moduleIds[1],
        title: "Data Link Layer",
        duration: "25 min",
        videoId: "YOUTUBE_VIDEO_ID_6",
        order: 3,
        description: "Data link layer functions and protocols"
      },
      // Module 3 lectures
      {
        moduleId: moduleIds[2],
        title: "Introduction to TCP/IP",
        duration: "20 min",
        videoId: "YOUTUBE_VIDEO_ID_7",
        order: 1,
        description: "Basics of TCP/IP protocol suite"
      },
      {
        moduleId: moduleIds[2],
        title: "IP Addressing",
        duration: "30 min",
        videoId: "YOUTUBE_VIDEO_ID_8",
        order: 2,
        description: "Understanding IP addresses and subnetting"
      },
      {
        moduleId: moduleIds[2],
        title: "Subnetting",
        duration: "35 min",
        videoId: "YOUTUBE_VIDEO_ID_9",
        order: 3,
        description: "Advanced concepts in IP subnetting"
      }
    ];

    const insertedLectures = await db.collection('computerNetworksLectures').insertMany(lectures);
    console.log('Lectures inserted:', insertedLectures.insertedCount);

    console.log('Computer networks content inserted successfully');
  } catch (error) {
    console.error('Error inserting computer networks content:', error);
  }
}

insertComputerNetworksContent(); 