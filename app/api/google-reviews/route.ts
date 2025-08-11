import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/google-reviews';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const placeId = process.env.GOOGLE_PLACE_ID;
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'Google Place ID not configured' },
        { status: 500 }
      );
    }

    const reviewsData = await fetchGoogleReviews(placeId);
    
    if (!reviewsData) {
      return NextResponse.json(
        { error: 'Failed to fetch Google reviews' },
        { status: 500 }
      );
    }

    // Cache for 1 hour (3600 seconds)
    const response = NextResponse.json(reviewsData);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
  } catch (error) {
    console.error('Google Reviews API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
