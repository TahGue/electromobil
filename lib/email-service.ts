/**
 * Email service for sending booking confirmations and notifications
 */

import { formatBookingDateTime } from './booking-utils';

interface BookingEmailData {
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  preferredDate: Date;
  preferredTime?: string;
  notes?: string;
  estimatedPrice?: number;
}

/**
 * Generate booking confirmation email HTML
 */
function generateBookingConfirmationHTML(data: BookingEmailData): string {
  const dateTimeStr = formatBookingDateTime(data.preferredDate, data.preferredTime);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bokningsbekräftelse - ElectroMobil</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-label { font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .booking-number { font-size: 24px; font-weight: bold; color: #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bokningsbekräftelse</h1>
          <div class="booking-number">Bokningsnummer: ${data.bookingNumber}</div>
        </div>
        
        <div class="content">
          <h2>Hej ${data.customerName}!</h2>
          <p>Tack för din bokning hos ElectroMobil. Vi har mottagit din förfrågan och kommer att kontakta dig inom kort för att bekräfta tiden.</p>
          
          <div class="booking-details">
            <h3>Bokningsdetaljer</h3>
            <div class="detail-row">
              <span class="detail-label">Bokningsnummer:</span>
              <span>${data.bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Tjänst:</span>
              <span>${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Önskat datum och tid:</span>
              <span>${dateTimeStr}</span>
            </div>
            ${data.estimatedPrice ? `
            <div class="detail-row">
              <span class="detail-label">Uppskattat pris:</span>
              <span>${data.estimatedPrice} SEK</span>
            </div>
            ` : ''}
            ${data.notes ? `
            <div class="detail-row">
              <span class="detail-label">Anteckningar:</span>
              <span>${data.notes}</span>
            </div>
            ` : ''}
          </div>
          
          <h3>Nästa steg</h3>
          <ul>
            <li>Vi kommer att kontakta dig inom 24 timmar för att bekräfta din bokning</li>
            <li>Om du behöver ändra eller avboka, kontakta oss så snart som möjligt</li>
            <li>Ta med dig enheten och eventuella tillbehör till ditt besök</li>
          </ul>
          
          <p><strong>Har du frågor?</strong> Kontakta oss på telefon eller e-post så hjälper vi dig gärna.</p>
        </div>
        
        <div class="footer">
          <p><strong>ElectroMobil</strong><br>
          Din partner för mobil- och elektronikreparationer<br>
          Telefon: [TELEFONNUMMER] | E-post: [E-POST]</p>
          <p>Detta är ett automatiskt meddelande. Svara inte på detta e-postmeddelande.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send booking confirmation email
 * Note: This is a placeholder implementation. In production, you would integrate with
 * an email service like SendGrid, AWS SES, or similar.
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean> {
  try {
    // For now, we'll just log the email content
    // In production, replace this with actual email sending logic
    console.log('=== BOOKING CONFIRMATION EMAIL ===');
    console.log(`To: ${data.customerEmail}`);
    console.log(`Subject: Bokningsbekräftelse - ${data.bookingNumber}`);
    console.log('HTML Content:', generateBookingConfirmationHTML(data));
    
    // TODO: Implement actual email sending
    // Example with a hypothetical email service:
    /*
    const emailService = new EmailService(process.env.EMAIL_API_KEY);
    await emailService.send({
      to: data.customerEmail,
      subject: `Bokningsbekräftelse - ${data.bookingNumber}`,
      html: generateBookingConfirmationHTML(data)
    });
    */
    
    // For now, return true to simulate successful sending
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    return false;
  }
}

/**
 * Send booking status update email to customer
 */
export async function sendBookingStatusUpdateEmail(
  bookingNumber: string,
  customerName: string,
  customerEmail: string,
  newStatus: string,
  message?: string
): Promise<boolean> {
  try {
    console.log('=== BOOKING STATUS UPDATE EMAIL ===');
    console.log(`To: ${customerEmail}`);
    console.log(`Subject: Uppdatering av bokning ${bookingNumber}`);
    console.log(`Status: ${newStatus}`);
    console.log(`Message: ${message || 'Ingen meddelande'}`);
    
    // TODO: Implement actual email sending for status updates
    return true;
  } catch (error) {
    console.error('Failed to send booking status update email:', error);
    return false;
  }
}
