import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // Validate request
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);
    //10 == salt rounds , A salt is a random value added to a password before hashing to ensure that 
    // even identical passwords result in different hashes. This enhances security by protecting against 
    // precomputed attacks like rainbow tables

    // Create new user
    const result = await db.collection('users').insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalSolved: 0,
        streak: 0,
        lastActive: new Date(),
        timeSpent: 0,
      },
    });


//sign function is used to create a JWT token.
    // It takes three main arguments:
    // 1. Payload: An object containing the data you want to encode in the token. In this case, it includes the user's ID, email, and username.
    // 2. Secret: A string used to sign the token, ensuring its integrity. This should be kept secure and is typically stored in an environment variable.
    // 3. Options: An optional object where you can specify additional settings, such as the token's expiration time ('expiresIn').
    // The 'sign' function is used to create a JSON Web Token (JWT) by encoding a payload with a secret key.
    const token = sign(
      {
        userId: result.insertedId.toString(),
        email,
        username,
      },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '7d' }
    );

    // Return success response
    return NextResponse.json(
      {
        message: 'User created successfully',
        token,
        user: {
          id: result.insertedId.toString(),
          username,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}
