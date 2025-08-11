import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Schema for validating promo countdown data
const promoCountdownSchema = z.object({
  isActive: z.boolean(),
  title: z.string().min(1, 'Titel krävs'),
  description: z.string().min(1, 'Beskrivning krävs'),
  percentage: z.number().min(1).max(100, 'Procent måste vara mellan 1-100'),
  couponCode: z.string().min(1, 'Kupongkod krävs'),
  endDateTime: z.string().refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime()) && parsed > new Date();
  }, 'Slutdatum måste vara i framtiden')
});

// GET - Fetch current promo countdown configuration
export async function GET() {
  try {
    const promoConfig = await prisma.promoCountdown.findUnique({
      where: { id: 'singleton' }
    });

    if (!promoConfig) {
      // Return default configuration if none exists
      return NextResponse.json({
        id: 'singleton',
        isActive: false,
        title: 'Tidsbegränsat erbjudande',
        description: 'rabatt på skärmbyten',
        percentage: 15,
        couponCode: 'SAVE15',
        endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json(promoConfig);
  } catch (error) {
    console.error('Error fetching promo countdown:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta kampanjinformation' },
      { status: 500 }
    );
  }
}

// POST/PUT - Update promo countdown configuration (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Obehörig åtkomst' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = promoCountdownSchema.parse(body);

    // Convert endDateTime string to Date object
    const endDateTime = new Date(validatedData.endDateTime);

    // Upsert the promo countdown configuration
    const updatedPromo = await prisma.promoCountdown.upsert({
      where: { id: 'singleton' },
      update: {
        isActive: validatedData.isActive,
        title: validatedData.title,
        description: validatedData.description,
        percentage: validatedData.percentage,
        couponCode: validatedData.couponCode,
        endDateTime: endDateTime,
        updatedAt: new Date()
      },
      create: {
        id: 'singleton',
        isActive: validatedData.isActive,
        title: validatedData.title,
        description: validatedData.description,
        percentage: validatedData.percentage,
        couponCode: validatedData.couponCode,
        endDateTime: endDateTime
      }
    });

    return NextResponse.json(updatedPromo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ogiltiga data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating promo countdown:', error);
    return NextResponse.json(
      { error: 'Kunde inte uppdatera kampanjinformation' },
      { status: 500 }
    );
  }
}
