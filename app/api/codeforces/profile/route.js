import { NextResponse } from 'next/server';
import { analyzeUserPerformance } from '@/utils/codeforcesApi';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cfHandle = searchParams.get('handle');

    if (!cfHandle) {
      return NextResponse.json(
        { error: 'Codeforces handle is required' },
        { status: 400 }
      );
    }

    const profileData = await analyzeUserPerformance(cfHandle);

    if (!profileData.success) {
      return NextResponse.json(
        { error: profileData.error },
        { status: 404 }
      );
    }

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching Codeforces profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}
