import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // In a stateless JWT-based authentication system, 
    // we don't actually need to do anything on the server side for logout.
    // The client will remove the token from storage.
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error during logout' },
      { status: 500 }
    );
  }
}
