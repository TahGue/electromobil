import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bookingFormSchema } from '@/lib/validations/booking';

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

    const booking = await prisma.booking.create({
      data: {
        customerName: body.name,
        customerEmail: body.email,
        customerPhone: body.phone,
        serviceId: body.serviceId,
        preferredDate: body.appointmentDate,
        notes: body.notes,
      },
    });

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
