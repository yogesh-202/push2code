import { connectDB } from '@/lib/db';
import User from '@/models/user.model';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Input validation schema
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  cfid: z.string().min(1, 'Codeforces ID is required')
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
});

// OTP generator
function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

// Email template
function getEmailTemplate(otp, username) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Verification</h2>
      <p>Hello ${username},</p>
      <p>Your verification code is:</p>
      <h1 style="font-size: 32px; letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    </div>
  `;
}

//  Main handler
export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = signupSchema.parse(body);
    const { email, password, username, fullName, cfid } = validatedData;

    await connectDB();

    //  Mongoose findOne
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json({
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Mongoose create and save
  const newUser = new User({
  email,
  username,
  password: hashedPassword,
  fullName,              // optional, default set
  cfid,                  // required, provide real value if available
  emailVerified: false,
  verificationOTP: otp,
  otpExpiry,
  createdAt: new Date(),
  updatedAt: new Date()
});


    await newUser.save();

    // Send mail
    try {
      await transporter.sendMail({
        from: `"CodingCrafter" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "Verify Your Email Address",
        html: getEmailTemplate(otp, username)
      });
    } catch (emailError) {
      //If email fails, delete user via mongoose
      await User.deleteOne({ email });
      throw new Error('Failed to send verification email');
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.'
    }, { status: 201 });

  } catch (error) {
    console.error('Signup Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: error.errors[0].message
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Registration failed. Please try again later.'
    }, { status: 500 });
  }
}

