import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/user/stats:path*',
    '/api/user/stats:path*',
    '/api/problems/:path*',
    '/api/analytics/:path*',
    '/api/daily-goals/:path*',
    '/api/backlogs/:path*',
  ],
};
