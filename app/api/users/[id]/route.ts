import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single user
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, phone: true }, // Exclude password
    });
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to fetch user', { status: 500 });
  }
}

// UPDATE a user
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, email, role, phone } = body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role, phone },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to update user', { status: 500 });
  }
}

// DELETE a user
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.user.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to delete user', { status: 500 });
  }
}
