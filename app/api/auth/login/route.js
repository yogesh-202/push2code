import { connectToDatabase } from '@/lib/mongodb';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate request
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Find user
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare password
    // The 'compare' function is used to check if the provided password matches the hashed password stored in the database.
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last active
    // The '_id' is the field name in the MongoDB document that uniquely identifies each document.
    // 'user._id' is the value of this field for the specific user being updated.
    // It is used to locate the correct document in the 'users' collection.
    await db.collection('users').updateOne(
   //user._id is retrieved from the database when you find the user document using the email. T
   // he findOne method returns the entire user document, including the _id, which is then used to update the stats.lastActive field.

      { _id: user._id },
      // The $set operator is used to update the value of a field in a document.
      // Here, it updates the 'stats.lastActive' field of the user document to the current date and time.
      { $set: { 'stats.lastActive': new Date() } }
    );

    // Create JWT token
    const token = sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Error during login' },
      { status: 500 }
    );
  }
}
