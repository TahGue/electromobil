import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/zettle/manual-setup - Manually set up Zettle tokens
export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accessToken, refreshToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Access token is required',
        message: 'Please provide accessToken in the request body'
      }, { status: 400 });
    }

    console.log('Manual Zettle setup: Saving tokens to database...');

    // Set expiry to 1 hour from now (typical for Zettle tokens)
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    const result = await prisma.zettleAuth.upsert({
      where: { id: 'singleton' },
      update: {
        accessToken,
        refreshToken: refreshToken || '',
        tokenType: 'Bearer',
        scope: 'READ:PURCHASE READ:PRODUCT WRITE:PRODUCT READ:FINANCE',
        expiresAt,
      },
      create: {
        id: 'singleton',
        accessToken,
        refreshToken: refreshToken || '',
        tokenType: 'Bearer',
        scope: 'READ:PURCHASE READ:PRODUCT WRITE:PRODUCT READ:FINANCE',
        expiresAt,
      },
    });

    console.log('Manual Zettle tokens saved successfully:', result.id);

    return NextResponse.json({
      success: true,
      message: 'Zettle tokens saved successfully',
      tokenId: result.id,
      expiresAt: result.expiresAt,
      hasRefreshToken: !!refreshToken
    });

  } catch (error) {
    console.error('Manual token setup failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to save Zettle tokens'
    }, { status: 500 });
  }
}

// GET /api/zettle/manual-setup - Show instructions
export async function GET() {
  return NextResponse.json({
    message: 'Manual Zettle Token Setup',
    instructions: [
      '1. Go to Zettle Developer Portal',
      '2. Use your app credentials to get an access token manually',
      '3. POST to this endpoint with: {"accessToken": "your_token", "refreshToken": "optional"}',
      '4. This bypasses the OAuth flow completely'
    ],
    endpoint: 'POST /api/zettle/manual-setup',
    requiredFields: ['accessToken'],
    optionalFields: ['refreshToken']
  });
}
