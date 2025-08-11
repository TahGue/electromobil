import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiUrl = process.env.ZETTLE_API_URL || 'https://oauth.zettle.com';
    const clientId = process.env.ZETTLE_CLIENT_ID;
    const redirectUri = process.env.ZETTLE_REDIRECT_URI || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://www.electromobil.se/api/zettle/oauth/callback'
        : 'http://localhost:3000/api/zettle/oauth/callback');
    const scope = process.env.ZETTLE_SCOPES || 'READ:PURCHASE READ:PRODUCT WRITE:PRODUCT READ:FINANCE';

    // Build the exact URL that would be used for OAuth
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId || 'MISSING',
      redirect_uri: redirectUri,
      scope: scope,
      state: 'debug-test-state'
    });

    const oauthUrl = `${apiUrl}/authorize?${params.toString()}`;

    return NextResponse.json({
      success: true,
      debug: {
        apiUrl,
        clientId: clientId ? 'SET' : 'MISSING',
        redirectUri,
        scope,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        oauthUrl,
        zettleRedirectUriEnvVar: process.env.ZETTLE_REDIRECT_URI || 'NOT_SET'
      },
      message: 'OAuth configuration debug info'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
