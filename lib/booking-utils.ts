/**
 * Booking utility functions
 */

/**
 * Generate a unique booking number in format: EM-YYYY-NNNN
 * EM = ElectroMobil, YYYY = current year, NNNN = sequential number
 */
export function generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `EM-${year}-${timestamp}${random}`;
}

/**
 * Format booking date and time for display
 */
export function formatBookingDateTime(date: Date, time?: string): string {
  const dateStr = date.toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  if (time) {
    return `${dateStr} kl. ${time}`;
  }
  
  return dateStr;
}

/**
 * Get booking status display text in Swedish
 */
export function getBookingStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: 'Väntande',
    CONFIRMED: 'Bekräftad',
    IN_PROGRESS: 'Pågående',
    COMPLETED: 'Slutförd',
    CANCELLED: 'Avbruten'
  };
  
  return statusMap[status] || status;
}

/**
 * Get booking status color for UI
 */
export function getBookingStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}
