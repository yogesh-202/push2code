import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // Verify token
    // Extract the token from the 'Authorization' header. The header typically follows the format 'Bearer <token>'.
    // The 'split' method is used to separate the 'Bearer' keyword from the actual token, and '[1]' accesses the token part.
    // The '?.split(' ')[1]' part is used to handle cases where the 'Authorization' header might not be present or might not follow the expected format.
    // If the header is not present, the 'split' method will return 'null', and the '?.split(' ')[1]' part will return 'null' as well.
    
    const token = request.headers.get('Authorization')?.split(' ')[1];

    // The 'verifyToken' function is imported from '@/lib/auth'.
    // It is used to validate the provided token and extract the payload, which typically includes user information.
    // If the token is invalid or expired, 'verifyToken' will return 'null' or throw an error.
    
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Get user
    // The code is querying the 'users' collection in the database to find a user document.
    // It uses the 'findOne' method to search for a document where the '_id' field matches the 'userId' from the token payload.
    // The 'ObjectId' function is used to convert the 'userId' string into a MongoDB ObjectId type, which is necessary for querying by '_id'.
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(payload.userId.toString()),
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without sensitive information
    return NextResponse.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      stats: user.stats || {
        totalSolved: 0,
        streak: 0,
        lastActive: new Date(),
        timeSpent: 0,
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Error fetching user' },
      { status: 500 }
    );
  }
} 