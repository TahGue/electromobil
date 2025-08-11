/**
 * WhatsApp Notifications Service
 * Handles automated WhatsApp notifications for booking updates
 */

export interface WhatsAppNotificationConfig {
  apiProvider: 'twilio' | 'messagebird' | 'manual' | 'disabled';
  apiKey?: string;
  apiSecret?: string;
  fromNumber: string;
  isEnabled: boolean;
  requireConsent: boolean;
}

export interface BookingNotification {
  customerPhone: string;
  customerName: string;
  bookingNumber: string;
  service: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  estimatedCompletion?: string;
  pickupInstructions?: string;
}

/**
 * Generate WhatsApp message templates for different booking statuses
 */
export function generateBookingMessage(notification: BookingNotification): string {
  const { customerName, bookingNumber, service, status, estimatedCompletion, pickupInstructions } = notification;
  
  const baseInfo = `Hej ${customerName}!\n\nBokning: ${bookingNumber}\nTjänst: ${service}\n\n`;
  
  switch (status) {
    case 'PENDING':
      return `${baseInfo}✅ Vi har mottagit din bokning!\n\nVi kommer att kontakta dig inom kort för att bekräfta tiden.\n\n📞 Ring oss på 070-123 45 67 om du har frågor.\n\nMvh,\nElectromobil`;
    
    case 'CONFIRMED':
      return `${baseInfo}🎯 Din bokning är bekräftad!\n\n${estimatedCompletion ? `⏰ Beräknad tid: ${estimatedCompletion}\n\n` : ''}Vi ser fram emot att hjälpa dig!\n\n📞 Ring oss på 070-123 45 67 om du behöver ändra något.\n\nMvh,\nElectromobil`;
    
    case 'IN_PROGRESS':
      return `${baseInfo}🔧 Vi har börjat arbeta med din enhet!\n\n${estimatedCompletion ? `⏰ Beräknad färdigställning: ${estimatedCompletion}\n\n` : ''}Vi hör av oss så snart reparationen är klar.\n\n📞 Ring oss på 070-123 45 67 för uppdateringar.\n\nMvh,\nElectromobil`;
    
    case 'COMPLETED':
      return `${baseInfo}🎉 Din reparation är klar!\n\n${pickupInstructions || 'Du kan hämta din enhet under våra öppettider.'}\n\n🕐 Öppettider:\nMån-Fre: 09:00-18:00\nLör: 10:00-16:00\n\n📞 Ring oss på 070-123 45 67 om du har frågor.\n\nTack för att du valde Electromobil!\nMvh,\nElectromobil`;
    
    case 'CANCELLED':
      return `${baseInfo}❌ Din bokning har avbokats.\n\nOm detta inte stämmer eller om du vill boka en ny tid, kontakta oss gärna.\n\n📞 Ring oss på 070-123 45 67\n💬 Eller chatta med oss på hemsidan\n\nMvh,\nElectromobil`;
    
    default:
      return `${baseInfo}Status uppdaterad.\n\n📞 Ring oss på 070-123 45 67 för mer information.\n\nMvh,\nElectromobil`;
  }
}

/**
 * Generate promotional/marketing messages
 */
export function generatePromoMessage(customerName: string, promoCode: string, discount: number): string {
  return `Hej ${customerName}! 🎉\n\nSpecialerbjudande bara för dig!\n\n💰 ${discount}% rabatt på alla reparationer\n🏷️ Använd kod: ${promoCode}\n⏰ Gäller till slutet av månaden\n\n📱 Boka på vår hemsida eller ring 070-123 45 67\n\nMvh,\nElectromobil\n\n---\nSvara STOPP för att avsluta erbjudanden`;
}

/**
 * Format Swedish phone number for WhatsApp API
 */
export function formatSwedishPhoneForAPI(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle Swedish format
  if (cleaned.startsWith('0')) {
    cleaned = '46' + cleaned.substring(1);
  } else if (!cleaned.startsWith('46')) {
    cleaned = '46' + cleaned;
  }
  
  return '+' + cleaned;
}

/**
 * Send WhatsApp notification (placeholder for actual API integration)
 */
export async function sendWhatsAppNotification(
  config: WhatsAppNotificationConfig,
  notification: BookingNotification
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  
  if (!config.isEnabled) {
    return { success: false, error: 'WhatsApp notifications are disabled' };
  }

  const message = generateBookingMessage(notification);
  const formattedPhone = formatSwedishPhoneForAPI(notification.customerPhone);
  
  try {
    // For now, log the message (replace with actual API call)
    console.log('📱 WhatsApp Notification:', {
      to: formattedPhone,
      message: message,
      provider: config.apiProvider
    });

    // TODO: Implement actual API calls based on provider
    switch (config.apiProvider) {
      case 'twilio':
        return await sendViaTwilio(config, formattedPhone, message);
      
      case 'messagebird':
        return await sendViaMessageBird(config, formattedPhone, message);
      
      case 'manual':
        // Generate a manual message for copy-paste
        return {
          success: true,
          messageId: 'manual',
          error: `Manual message ready:\nTo: ${formattedPhone}\nMessage: ${message}`
        };
      
      default:
        return { success: false, error: 'Unknown API provider' };
    }
    
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Twilio WhatsApp API integration (placeholder)
 */
async function sendViaTwilio(
  config: WhatsAppNotificationConfig,
  phone: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // TODO: Implement Twilio WhatsApp API
  // const client = twilio(config.apiKey, config.apiSecret);
  // const result = await client.messages.create({
  //   from: 'whatsapp:' + config.fromNumber,
  //   to: 'whatsapp:' + phone,
  //   body: message
  // });
  
  return { success: true, messageId: 'twilio_placeholder' };
}

/**
 * MessageBird WhatsApp API integration (placeholder)
 */
async function sendViaMessageBird(
  config: WhatsAppNotificationConfig,
  phone: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // TODO: Implement MessageBird WhatsApp API
  return { success: true, messageId: 'messagebird_placeholder' };
}

/**
 * Check if customer has consented to WhatsApp notifications
 */
export function hasWhatsAppConsent(customerPhone: string): boolean {
  // TODO: Check database for customer consent
  // This would be stored when customer opts in during booking
  return true; // Placeholder
}

/**
 * Swedish business hours check for appropriate sending times
 */
export function isAppropriateTimeToSend(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday
  
  // Don't send between 22:00 and 08:00
  if (hour >= 22 || hour < 8) return false;
  
  // Don't send on Sundays
  if (day === 0) return false;
  
  return true;
}

/**
 * Queue message for later if outside business hours
 */
export interface QueuedMessage {
  id: string;
  notification: BookingNotification;
  scheduledFor: Date;
  attempts: number;
  status: 'pending' | 'sent' | 'failed';
}
