import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE a booking
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.booking.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to delete booking', { status: 500 });
  }
}

// UPDATE a booking's status
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!status) {
      return new NextResponse('Status is required', { status: 400 });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to update booking', { status: 500 });
  }
}
