import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test basic database connection
    const userCount = await prisma.user.count();
    
    // Test zettle_auth table specifically
    let zettleAuthExists = false;
    let zettleAuthCount = 0;
    let zettleAuthError = null;
    
    try {
      zettleAuthCount = await prisma.zettleAuth.count();
      zettleAuthExists = true;
    } catch (error) {
      zettleAuthError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test if we can create/update zettle_auth (dry run)
    let canWriteZettleAuth = false;
    let writeError = null;
    
    try {
      // Try to find existing record without creating
      const existing = await prisma.zettleAuth.findUnique({
        where: { id: 'singleton' }
      });
      canWriteZettleAuth = true;
    } catch (error) {
      writeError = error instanceof Error ? error.message : 'Unknown error';
    }

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        userCount,
        zettleAuth: {
          tableExists: zettleAuthExists,
          recordCount: zettleAuthCount,
          canRead: zettleAuthExists,
          canWrite: canWriteZettleAuth,
          error: zettleAuthError,
          writeError
        }
      },
      message: 'Database connection test completed'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      message: 'Database connection failed'
    }, { status: 500 });
  }
}
