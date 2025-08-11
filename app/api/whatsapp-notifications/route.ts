import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { 
  sendWhatsAppNotification, 
  generateBookingMessage,
  isAppropriateTimeToSend,
  type BookingNotification,
  type WhatsAppNotificationConfig 
} from '@/lib/whatsapp-notifications';

export const dynamic = 'force-dynamic';

// GET - Fetch WhatsApp notification settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Obehörig åtkomst' },
        { status: 401 }
      );
    }

    // Return default configuration (could be stored in database later)
    const config: WhatsAppNotificationConfig = {
      apiProvider: 'manual',
      fromNumber: '0701234567',
      isEnabled: false,
      requireConsent: true
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching WhatsApp notification config:', error);
    return NextResponse.json(
      { error: 'Kunde inte hämta WhatsApp-notifikationsinställningar' },
      { status: 500 }
    );
  }
}

// POST - Send WhatsApp notification for a specific booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Obehörig åtkomst' },
        { status: 401 }
      );
    }

    const { bookingId, messageType, customMessage } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID krävs' },
        { status: 400 }
      );
    }

    // Fetch booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true }
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Bokning hittades inte' },
        { status: 404 }
      );
    }

    // Check if customer has consented to WhatsApp notifications
    if (!booking.whatsappConsent) {
      return NextResponse.json(
        { error: 'Kunden har inte gett samtycke för WhatsApp-notifikationer' },
        { status: 400 }
      );
    }

    // Check if it's appropriate time to send
    if (!isAppropriateTimeToSend()) {
      return NextResponse.json(
        { error: 'Meddelanden skickas endast mellan 08:00-22:00, måndag-lördag' },
        { status: 400 }
      );
    }

    // Create notification object
    const notification: BookingNotification = {
      customerPhone: booking.customerPhone,
      customerName: booking.customerName,
      bookingNumber: booking.bookingNumber,
      service: booking.service.name,
      status: booking.status,
      estimatedCompletion: booking.preferredDate.toLocaleDateString('sv-SE'),
      pickupInstructions: 'Du kan hämta din enhet under våra öppettider.'
    };

    // Get WhatsApp config (in real implementation, this would be from database)
    const config: WhatsAppNotificationConfig = {
      apiProvider: 'manual',
      fromNumber: '0701234567',
      isEnabled: true,
      requireConsent: true
    };

    // Send the notification
    const result = await sendWhatsAppNotification(config, notification);

    if (result.success) {
      // Update booking with notification sent status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          whatsappSent: true,
          lastNotificationSent: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: 'WhatsApp-notifikation skickad',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Kunde inte skicka WhatsApp-notifikation' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod när WhatsApp-notifikationen skulle skickas' },
      { status: 500 }
    );
  }
}
