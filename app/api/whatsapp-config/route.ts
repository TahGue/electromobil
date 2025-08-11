import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Schema for validating WhatsApp configuration
const whatsappConfigSchema = z.object({
  isEnabled: z.boolean(),
  phoneNumber: z.string().min(1, 'Telefonnummer krävs'),
  businessName: z.string().min(1, 'Företagsnamn krävs'),
  welcomeMessage: z.string().min(1, 'Välkomstmeddelande krävs'),
  position: z.enum(['bottom-right', 'bottom-left']).default('bottom-right')
});

// GET - Fetch current WhatsApp configuration
export async function GET() {
  try {
    // For now, return default configuration
    // In the future, this could be stored in database
    const defaultConfig = {
      id: 'singleton',
      isEnabled: true,
      phoneNumber: '0701234567',
      businessName: 'Electromobil',
      welcomeMessage: 'Hej! 👋 Hur kan vi hjälpa dig idag?',
      position: 'bottom-right',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(defaultConfig);
  } catch (error) {
    console.error('Error fetching WhatsApp config:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta WhatsApp-konfiguration' },
      { status: 500 }
    );
  }
}

// POST - Update WhatsApp configuration (admin only)
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
    const validatedData = whatsappConfigSchema.parse(body);

    // For now, just return the validated data
    // In the future, this could be stored in database
    const updatedConfig = {
      id: 'singleton',
      ...validatedData,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(updatedConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ogiltiga data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating WhatsApp config:', error);
    return NextResponse.json(
      { error: 'Kunde inte uppdatera WhatsApp-konfiguration' },
      { status: 500 }
    );
  }
}
