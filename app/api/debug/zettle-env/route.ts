import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check all Zettle-related environment variables
    const zettleEnv = {
      ZETTLE_CLIENT_ID: process.env.ZETTLE_CLIENT_ID ? 'SET' : 'MISSING',
      ZETTLE_CLIENT_SECRET: process.env.ZETTLE_CLIENT_SECRET ? 'SET' : 'MISSING',
      ZETTLE_API_URL: process.env.ZETTLE_API_URL || 'DEFAULT (https://oauth.zettle.com)',
      ZETTLE_REDIRECT_URI: process.env.ZETTLE_REDIRECT_URI || 'MISSING',
      ZETTLE_ENVIRONMENT: process.env.ZETTLE_ENVIRONMENT || 'MISSING',
      ZETTLE_CURRENCY: process.env.ZETTLE_CURRENCY || 'MISSING',
      ZETTLE_COUNTRY: process.env.ZETTLE_COUNTRY || 'MISSING',
      ZETTLE_SCOPES: process.env.ZETTLE_SCOPES || 'DEFAULT',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV || 'NOT_SET'
    };

    const isConfigured = !!(process.env.ZETTLE_CLIENT_ID && process.env.ZETTLE_CLIENT_SECRET);

    return NextResponse.json({
      success: true,
      isConfigured,
      environment: zettleEnv,
      message: isConfigured ? 
        'Zettle environment variables are configured' : 
        'Missing ZETTLE_CLIENT_ID and/or ZETTLE_CLIENT_SECRET'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Failed to check Zettle environment variables'
    }, { status: 500 });
  }
}
