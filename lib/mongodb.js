import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yogn7294:Yogikamongo%407240@foodapp.ozfxw.mongodb.net/first_db?retryWrites=true&w=majority&appName=Foodapp';
const MONGODB_DB = process.env.MONGODB_DB || 'first_db';

// Create cached connection variable
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // If the connection is already established, return the cached connection
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Set the connection options
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to the server
  let client = new MongoClient(MONGODB_URI, opts);
  await client.connect();
  let db = client.db(MONGODB_DB);

  // Cache the client and connection
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Initialize database with collections and indexes
export async function initDatabase() {
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
  
  // Solved problems collection
  if (!collectionNames.includes('solvedProblems')) {
    await db.createCollection('solvedProblems');
    await db.collection('solvedProblems').createIndex({ userId: 1, problemId: 1 }, { unique: true });
    await db.collection('solvedProblems').createIndex({ userId: 1 });
    await db.collection('solvedProblems').createIndex({ solvedAt: 1 });
  }
  
  console.log('Database initialized');
}
