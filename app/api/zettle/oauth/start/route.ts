import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const apiUrl = process.env.ZETTLE_API_URL || 'https://oauth.zettle.com';
  const clientId = process.env.ZETTLE_CLIENT_ID;
  const redirectUri = process.env.ZETTLE_REDIRECT_URI || 'http://localhost:3000/api/zettle/oauth/callback';
  const scope = process.env.ZETTLE_SCOPES || 'READ:PURCHASE READ:PRODUCT WRITE:PRODUCT READ:FINANCE';

  if (!clientId) {
    return NextResponse.json({ error: 'Missing ZETTLE_CLIENT_ID' }, { status: 500 });
  }

  // Generate a CSRF state value and store in an HttpOnly cookie
  const state = crypto.randomUUID();
  cookies().set('zettle_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600, // 10 minutes
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  });

  const url = `${apiUrl}/authorize?${params.toString()}`;
  return NextResponse.redirect(url);
}
