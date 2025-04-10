import { NextResponse } from 'next/server';
import { 
  getUserInfo, 
  getUserRatingHistory, 
  analyzeUserPerformance 
} from '@/utils/codeforcesApi';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const handle = searchParams.get('handle');
    
    if (!handle) {
      return NextResponse.json(
        { error: 'Codeforces handle is required' },
        { status: 400 }
      );
    }
    
    // Fetch user profile information
    const userResult = await getUserInfo(handle);
    
    if (!userResult.success) {
      return NextResponse.json(
        { error: userResult.error || 'User not found' },
        { status: 404 }
      );
    }
    
    // Fetch rating history
    const ratingResult = await getUserRatingHistory(handle);
    
    // Fetch user performance analytics
    const performance = await analyzeUserPerformance(handle);
    
    return NextResponse.json({
      user: userResult.user,
      ratingHistory: ratingResult.success ? ratingResult.ratingHistory : [],
      performance
    });
  } catch (error) {
    console.error('Error fetching Codeforces profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Codeforces profile' },
      { status: 500 }
    );
  }
}