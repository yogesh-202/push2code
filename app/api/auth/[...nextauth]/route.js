import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from '@/lib/db';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
    
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB();

        const dbUser = await User.findOne({ email: user.email });
        const isSignup = account.callbackUrl?.includes('mode=signup');

        if (!dbUser && !isSignup) {
          // Redirect to signup page if user not found and not coming from signup
          return `/signup?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || '')}`;
        }

        if (!dbUser && isSignup) {
          // Create new user on Google signup
          const newUser = await User.create({
            name: user.name,
            email: user.email,
            provider: 'google',
          });
          user.id = newUser._id.toString();
        }

        if (dbUser && isSignup) {
          // Prevent signup if user already exists
          return '/login?error=User already exists';
        }

        if (dbUser) {
          user.id = dbUser._id.toString();
        }
      }

      return true;
    }
    ,
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
  session: {
    strategy: 'jwt',
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
