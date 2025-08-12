import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { testToken } = await request.json();
    
    // Test saving a dummy token to see if the database operation works
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now
    
    console.log('Testing OAuth token save...');
    
    const result = await prisma.zettleAuth.upsert({
      where: { id: 'singleton' },
      update: {
        accessToken: testToken || 'test-access-token',
        refreshToken: 'test-refresh-token',
        tokenType: 'Bearer',
        scope: 'test-scope',
        expiresAt,
      },
      create: {
        id: 'singleton',
        accessToken: testToken || 'test-access-token',
        refreshToken: 'test-refresh-token',
        tokenType: 'Bearer',
        scope: 'test-scope',
        expiresAt,
      },
    });

    console.log('Test token save successful:', result.id);

    return NextResponse.json({
      success: true,
      message: 'Test token saved successfully',
      tokenId: result.id,
      expiresAt: result.expiresAt
    });

  } catch (error) {
    console.error('Test token save failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Test token save failed'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if test token exists
    const authRecord = await prisma.zettleAuth.findUnique({
      where: { id: 'singleton' }
    });

    return NextResponse.json({
      success: true,
      hasToken: !!authRecord,
      tokenInfo: authRecord ? {
        id: authRecord.id,
        hasAccessToken: !!authRecord.accessToken,
        hasRefreshToken: !!authRecord.refreshToken,
        expiresAt: authRecord.expiresAt,
        isExpired: new Date() > authRecord.expiresAt,
        createdAt: authRecord.createdAt,
        updatedAt: authRecord.updatedAt
      } : null
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
