import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/zettle/auth - Check OAuth connection status
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check for existing OAuth tokens
    const authRecord = await prisma.zettleAuth.findUnique({
      where: { id: 'singleton' }
    });

    if (!authRecord) {
      return NextResponse.json({
        success: false,
        error: 'Zettle is not connected',
        message: 'Please connect via OAuth by visiting /api/zettle/oauth/start',
        needsConnection: true
      }, { status: 400 });
    }

    // Check if token is expired
    const isExpired = new Date() > authRecord.expiresAt;
    if (isExpired) {
      return NextResponse.json({
        success: false,
        error: 'Zettle connection expired',
        message: 'Please reconnect via OAuth by visiting /api/zettle/oauth/start',
        needsReconnection: true,
        expiresAt: authRecord.expiresAt
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Zettle OAuth connection is active',
      tokenType: authRecord.tokenType,
      expiresAt: authRecord.expiresAt,
      scope: authRecord.scope,
      connected: true
    });

  } catch (error) {
    console.error('Zettle auth check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication check failed' },
      { status: 500 }
    );
  }
}
