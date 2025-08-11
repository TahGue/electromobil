import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendBookingStatusUpdateEmail } from '@/lib/email-service';
import { getBookingStatusText } from '@/lib/booking-utils';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, message } = await request.json();

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get current booking
    const currentBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { service: { select: { name: true } } }
    });

    if (!currentBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { 
        status,
        updatedAt: new Date()
      },
      include: { service: { select: { name: true } } }
    });

    // Send status update email to customer
    try {
      await sendBookingStatusUpdateEmail(
        updatedBooking.bookingNumber || updatedBooking.id,
        updatedBooking.customerName,
        updatedBooking.customerEmail,
        getBookingStatusText(status),
        message
      );
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the status update if email fails
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}
