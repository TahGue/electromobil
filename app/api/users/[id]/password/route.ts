import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// PUT /api/users/[id]/password - Change user password (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { newPassword, confirmPassword } = await request.json();
    
    // Validation
    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: 'Både nytt lösenord och bekräftelse krävs' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: 'Lösenorden matchar inte' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Lösenordet måste vara minst 8 tecken långt' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Användaren hittades inte' },
        { status: 404 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await prisma.user.update({
      where: { id: params.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: 'Lösenordet har uppdaterats framgångsrikt' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { message: 'Ett fel uppstod vid uppdatering av lösenordet' },
      { status: 500 }
    );
  }
}
