/**
 * WhatsApp Chat Service
 * Handles WhatsApp click-to-chat functionality
 */

export interface WhatsAppConfig {
  phoneNumber: string;
  defaultMessage: string;
  isEnabled: boolean;
  buttonText: string;
  welcomeMessage?: string;
}

/**
 * Format phone number for WhatsApp (remove spaces, dashes, add country code)
 */
export function formatWhatsAppNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add Sweden country code if not present
  if (!cleaned.startsWith('46')) {
    // Remove leading 0 if present (Swedish mobile numbers)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    cleaned = '46' + cleaned;
  }
  
  return cleaned;
}

/**
 * Generate WhatsApp click-to-chat URL
 */
export function generateWhatsAppURL(phoneNumber: string, message?: string): string {
  const formattedNumber = formatWhatsAppNumber(phoneNumber);
  const encodedMessage = message ? encodeURIComponent(message) : '';
  
  return `https://wa.me/${formattedNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

/**
 * Generate default message for repair shop
 */
export function getDefaultRepairShopMessage(service?: string): string {
  const baseMessage = "Hej! Jag är intresserad av era reparationstjänster.";
  
  if (service) {
    return `${baseMessage} Jag behöver hjälp med ${service}.`;
  }
  
  return baseMessage;
}

/**
 * Check if WhatsApp is available (mobile detection)
 */
export function isWhatsAppAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if it's a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  return isMobile;
}

/**
 * Open WhatsApp chat
 */
export function openWhatsAppChat(phoneNumber: string, message?: string): void {
  const url = generateWhatsAppURL(phoneNumber, message);
  
  if (isWhatsAppAvailable()) {
    // On mobile, try to open WhatsApp app first
    window.location.href = url;
  } else {
    // On desktop, open WhatsApp Web
    window.open(url, '_blank');
  }
}

/**
 * Get business hours message
 */
export function getBusinessHoursMessage(): string {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Assuming business hours: Monday-Friday 9-18, Saturday 10-16, Sunday closed
  const isWeekday = day >= 1 && day <= 5;
  const isSaturday = day === 6;
  const isSunday = day === 0;
  
  if (isSunday) {
    return "Vi är stängda på söndagar. Vi svarar på måndag!";
  }
  
  if (isWeekday && hour >= 9 && hour < 18) {
    return "Vi är öppna nu! Förvänta dig snabbt svar.";
  }
  
  if (isSaturday && hour >= 10 && hour < 16) {
    return "Vi är öppna nu! Förvänta dig snabbt svar.";
  }
  
  return "Vi är för närvarande stängda. Vi svarar så snart vi öppnar!";
}
