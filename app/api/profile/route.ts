import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        bookings: {
          include: {
            service: {
              select: {
                name: true,
                description: true,
                price: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, firstName, lastName } = body;

    // Validate input
    if (name && typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (phone && typeof phone !== 'string') {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }
    if (firstName && typeof firstName !== 'string') {
      return NextResponse.json({ error: 'Invalid first name' }, { status: 400 });
    }
    if (lastName && typeof lastName !== 'string') {
      return NextResponse.json({ error: 'Invalid last name' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        image: true,
        provider: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
