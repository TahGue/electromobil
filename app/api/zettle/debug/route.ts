import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if ZettleAuth table exists and has data
    const authRecord = await prisma.zettleAuth.findUnique({
      where: { id: 'singleton' }
    });

    // Check environment variables
    const envCheck = {
      ZETTLE_CLIENT_ID: !!process.env.ZETTLE_CLIENT_ID,
      ZETTLE_CLIENT_SECRET: !!process.env.ZETTLE_CLIENT_SECRET,
      ZETTLE_API_URL: process.env.ZETTLE_API_URL,
      ZETTLE_REDIRECT_URI: process.env.ZETTLE_REDIRECT_URI,
      ZETTLE_ENVIRONMENT: process.env.ZETTLE_ENVIRONMENT,
      ZETTLE_SCOPES: process.env.ZETTLE_SCOPES,
    };

    return NextResponse.json({
      success: true,
      authRecord: authRecord ? {
        id: authRecord.id,
        hasAccessToken: !!authRecord.accessToken,
        hasRefreshToken: !!authRecord.refreshToken,
        expiresAt: authRecord.expiresAt,
        isExpired: new Date() > authRecord.expiresAt,
        tokenType: authRecord.tokenType,
        scope: authRecord.scope,
        createdAt: authRecord.createdAt,
        updatedAt: authRecord.updatedAt,
      } : null,
      environment: envCheck,
      oauthStartUrl: '/api/zettle/oauth/start',
      message: authRecord ? 
        'Zettle OAuth record found in database' : 
        'No Zettle OAuth record found - need to connect via /api/zettle/oauth/start'
    });

  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check Zettle authentication status'
    }, { status: 500 });
  }
}
