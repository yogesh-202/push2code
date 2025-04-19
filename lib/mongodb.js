const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise
async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return { client, db };
}

// Initialize database with collections and indexes
async function initDatabase() {
  const { db } = await connectToDatabase();
  
  // Create collections if they don't exist
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  // Users collection
  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
  }
  
  // Problems collection
  if (!collectionNames.includes('problems')) {
    await db.createCollection('problems');
    await db.collection('problems').createIndex({ title: 1 }, { unique: true });
    await db.collection('problems').createIndex({ topic: 1 });
    await db.collection('problems').createIndex({ difficulty: 1 });
  }
  
  // SQL Problems collection
  if (!collectionNames.includes('sqlProblems')) {
    await db.createCollection('sqlProblems');
    await db.collection('sqlProblems').createIndex({ title: 1 }, { unique: true });
    await db.collection('sqlProblems').createIndex({ leetcodeId: 1 }, { unique: true });
    await db.collection('sqlProblems').createIndex({ difficulty: 1 });
    await db.collection('sqlProblems').createIndex({ tags: 1 });
    await db.collection('sqlProblems').createIndex({ leetcodeLink: 1 });
    await db.collection('sqlProblems').createIndex({ youtubeLink: 1 });
    await db.collection('sqlProblems').createIndex({ revisionStatus: 1 });
  }
  
  // Solved problems collection
  if (!collectionNames.includes('solvedProblems')) {
    await db.createCollection('solvedProblems');
    await db.collection('solvedProblems').createIndex({ userId: 1, problemId: 1 }, { unique: true });
    await db.collection('solvedProblems').createIndex({ userId: 1 });
    await db.collection('solvedProblems').createIndex({ solvedAt: 1 });
  }
  
  // Daily goals collection
  if (!collectionNames.includes('dailyGoals')) {
    await db.createCollection('dailyGoals');
    await db.collection('dailyGoals').createIndex({ userId: 1, problemId: 1, date: 1 }, { unique: true });
    await db.collection('dailyGoals').createIndex({ userId: 1, date: 1 });
    await db.collection('dailyGoals').createIndex({ date: 1 });
  }
  
  // Backlogs collection
  if (!collectionNames.includes('backlogs')) {
    await db.createCollection('backlogs');
    await db.collection('backlogs').createIndex({ userId: 1, problemId: 1 }, { unique: true });
    await db.collection('backlogs').createIndex({ userId: 1 });
    await db.collection('backlogs').createIndex({ addedAt: 1 });
  }

  // Revision problems collection
  if (!collectionNames.includes('revisionProblems')) {
    await db.createCollection('revisionProblems');
    await db.collection('revisionProblems').createIndex({ userId: 1, problemId: 1 }, { unique: true });
    await db.collection('revisionProblems').createIndex({ userId: 1 });
    await db.collection('revisionProblems').createIndex({ markedAt: 1 });
  }

  // Codeforces problems collection
  if (!collectionNames.includes('codeforcesProblems')) {
    await db.createCollection('codeforcesProblems');
    await db.collection('codeforcesProblems').createIndex({ contestId: 1, index: 1 }, { unique: true });
    await db.collection('codeforcesProblems').createIndex({ rating: 1 });
    await db.collection('codeforcesProblems').createIndex({ tags: 1 });
    await db.collection('codeforcesProblems').createIndex({ name: 1 });
  }

  // System Design Collections
  if (!collectionNames.includes('systemDesignModules')) {
    await db.createCollection('systemDesignModules');
    await db.collection('systemDesignModules').createIndex({ moduleNumber: 1 }, { unique: true });
    await db.collection('systemDesignModules').createIndex({ order: 1 });
  }

  if (!collectionNames.includes('systemDesignLectures')) {
    await db.createCollection('systemDesignLectures');
    await db.collection('systemDesignLectures').createIndex({ moduleId: 1, order: 1 });
    await db.collection('systemDesignLectures').createIndex({ moduleId: 1, title: 1 });
  }

  if (!collectionNames.includes('systemDesignProgress')) {
    await db.createCollection('systemDesignProgress');
    await db.collection('systemDesignProgress').createIndex({ userId: 1, lectureId: 1 }, { unique: true });
    await db.collection('systemDesignProgress').createIndex({ userId: 1, completedAt: -1 });
  }

  // Computer Networks Collections
  if (!collectionNames.includes('computerNetworksModules')) {
    await db.createCollection('computerNetworksModules');
    await db.collection('computerNetworksModules').createIndex({ moduleNumber: 1 }, { unique: true });
    await db.collection('computerNetworksModules').createIndex({ order: 1 });
  }

  if (!collectionNames.includes('computerNetworksLectures')) {
    await db.createCollection('computerNetworksLectures');
    await db.collection('computerNetworksLectures').createIndex({ moduleId: 1, order: 1 });
    await db.collection('computerNetworksLectures').createIndex({ moduleId: 1, title: 1 });
  }

  if (!collectionNames.includes('computerNetworksProgress')) {
    await db.createCollection('computerNetworksProgress');
    await db.collection('computerNetworksProgress').createIndex({ userId: 1, lectureId: 1 }, { unique: true });
    await db.collection('computerNetworksProgress').createIndex({ userId: 1, completedAt: -1 });
  }


// System Design Collections
if (!collectionNames.includes('osModules')) {
  await db.createCollection('osModules');
  await db.collection('osModules').createIndex({ moduleNumber: 1 }, { unique: true });
  await db.collection('osModules').createIndex({ order: 1 });
}

if (!collectionNames.includes('osLectures')) {
  await db.createCollection('osLectures');
  await db.collection('osLectures').createIndex({ moduleId: 1, order: 1 });
  await db.collection('osLectures').createIndex({ moduleId: 1, title: 1 });
}

if (!collectionNames.includes('osProgress')) {
  await db.createCollection('osProgress');
  await db.collection('osProgress').createIndex({ userId: 1, lectureId: 1 }, { unique: true });
  await db.collection('osProgress').createIndex({ userId: 1, completedAt: -1 });
}

  
  console.log('Database initialized');
}

// Initialize the database when this module is loaded
initDatabase().catch(console.error);

// Export the functions
module.exports = {
  connectToDatabase,
  initDatabase
};
