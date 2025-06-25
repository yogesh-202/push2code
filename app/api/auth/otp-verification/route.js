import {connectDB} from '@/lib/db';
import { NextResponse } from 'next/server';
import User from '@/models/user.model';
import { z } from 'zod';
import NextAuth from 'next-auth';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    await connectDB();

    const user = await User.findOne({ 
      email,
      verificationOTP: otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Update user verification status
    await User.updateOne(
      { email },
      { 
        $set: { emailVerified: true },
        $unset: { verificationOTP: "", otpExpiry: "" }
      }
    );

    return NextResponse.json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}


