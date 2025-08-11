import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingFormSchema } from '@/lib/validations/booking';
import { generateBookingNumber } from '@/lib/booking-utils';
import { sendBookingConfirmationEmail } from '@/lib/email-service';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { service: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to fetch bookings', { status: 500 });
  }
}

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  appointmentDate: string;
  notes?: string;
}

export async function POST(req: Request) {
  try {
    const json: BookingRequest = await req.json();
    const body = bookingFormSchema.parse({
      ...json,
      appointmentDate: new Date(json.appointmentDate)
    });

    // Generate unique booking number
    const bookingNumber = generateBookingNumber();

    // Get service details for email
    const service = await prisma.service.findUnique({
      where: { id: body.serviceId },
      select: { name: true, price: true }
    });

    if (!service) {
      return new NextResponse('Service not found', { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerName: body.name,
        customerEmail: body.email,
        customerPhone: body.phone,
        serviceId: body.serviceId,
        preferredDate: body.appointmentDate,
        notes: body.notes,
        estimatedPrice: service.price,
      },
      include: {
        service: { select: { name: true } }
      }
    });

    // Send confirmation email
    try {
      const emailSent = await sendBookingConfirmationEmail({
        bookingNumber: booking.bookingNumber,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        serviceName: service.name,
        preferredDate: booking.preferredDate,
        preferredTime: booking.preferredTime || undefined,
        notes: booking.notes || undefined,
        estimatedPrice: Number(booking.estimatedPrice) || undefined,
      });

      // Update booking to mark email as sent
      if (emailSent) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { emailSent: true }
        });
      }
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the booking creation if email fails
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof require('zod').ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }

    console.error('Booking error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'An internal server error occurred.' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
