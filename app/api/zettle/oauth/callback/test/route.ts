import { NextResponse } from 'next/server';

export async function GET() {
  console.log('OAuth callback test route accessed');
  
  return NextResponse.json({
    success: true,
    message: 'OAuth callback route is working',
    timestamp: new Date().toISOString(),
    url: '/api/zettle/oauth/callback/test'
  });
}
