import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  console.log('=== ZETTLE OAUTH CALLBACK START ===');
  console.log('Request URL:', req.url);
  
  try {
    const apiUrl = process.env.ZETTLE_API_URL || 'https://oauth.zettle.com';
    const clientId = process.env.ZETTLE_CLIENT_ID;
    const clientSecret = process.env.ZETTLE_CLIENT_SECRET;
    const redirectUri = process.env.ZETTLE_REDIRECT_URI || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://www.electromobil.se/api/zettle/oauth/callback'
        : 'http://localhost:3000/api/zettle/oauth/callback');

    console.log('Environment check:', { 
      hasClientId: !!clientId, 
      hasClientSecret: !!clientSecret, 
      apiUrl, 
      redirectUri 
    });

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('OAuth callback params:', { code: !!code, state, error });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    console.log('Base URL:', baseUrl);
    
    if (error) {
      return NextResponse.redirect(`${baseUrl}/admin/pos?zettle_error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/admin/pos?zettle_error=missing_code`);
    }

    // Validate state parameter to prevent CSRF
    const cookieStore = cookies();
    const expectedState = cookieStore.get('zettle_oauth_state')?.value;
    if (!state || !expectedState || state !== expectedState) {
      // Clear cookie if present
      cookieStore.set('zettle_oauth_state', '', { httpOnly: true, path: '/', maxAge: 0 });
      return NextResponse.redirect(`${baseUrl}/admin/pos?zettle_error=invalid_state`);
    }
    // Clear state cookie after successful validation
    cookieStore.set('zettle_oauth_state', '', { httpOnly: true, path: '/', maxAge: 0 });

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${baseUrl}/admin/pos?zettle_error=missing_client`);
    }

    const tokenUrl = `${apiUrl}/token`;
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    });

    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basic}`,
      },
      body: body.toString(),
    });

    const text = await resp.text();
    if (!resp.ok) {
      return NextResponse.redirect(`${baseUrl}/admin/pos?zettle_error=${encodeURIComponent(`token_exchange_failed:${resp.status}:${text}`)}`);
    }

    const data = JSON.parse(text) as {
      access_token: string;
      refresh_token?: string;
      token_type?: string;
      expires_in: number;
      scope?: string;
    };

    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    console.log('Zettle OAuth callback: Saving tokens to database...');
    console.log('Token expires at:', expiresAt.toISOString());
    console.log('Has refresh token:', !!data.refresh_token);

    try {
      const result = await prisma.zettleAuth.upsert({
        where: { id: 'singleton' },
        update: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token || '',
          tokenType: data.token_type || 'Bearer',
          scope: data.scope,
          expiresAt,
        },
        create: {
          id: 'singleton',
          accessToken: data.access_token,
          refreshToken: data.refresh_token || '',
          tokenType: data.token_type || 'Bearer',
          scope: data.scope,
          expiresAt,
        },
      });
      console.log('Zettle OAuth tokens saved successfully:', result.id);
    } catch (dbError) {
      console.error('Failed to save Zettle OAuth tokens to database:', dbError);
      return NextResponse.redirect(`${baseUrl}/admin/pos?zettle_error=${encodeURIComponent('database_save_failed:' + (dbError as Error).message)}`);
    }

    return NextResponse.redirect(`${baseUrl}/admin/pos?zettle_connected=1`);
  } catch (e: any) {
    const msg = e?.message || 'unknown_error';
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/admin/pos?zettle_error=${encodeURIComponent(msg)}`);
  }
}
