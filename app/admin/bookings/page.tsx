'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, UserIcon, PhoneIcon, MailIcon, ClockIcon, MessageCircle, Send } from 'lucide-react';

// Enhanced booking interface with new fields
interface BookingItem {
  id: string;
  bookingNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string; // ISO
  preferredTime?: string | null;
  status: string;
  estimatedPrice?: number | null;
  finalPrice?: number | null;
  emailSent?: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  notes?: string | null;
  service?: { name: string } | null;
}

// Booking status utilities
const getBookingStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: 'Väntande',
    CONFIRMED: 'Bekräftad',
    IN_PROGRESS: 'Pågående',
    COMPLETED: 'Slutförd',
    CANCELLED: 'Avbruten'
  };
  return statusMap[status] || status;
};

const getBookingStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    IN_PROGRESS: 'bg-purple-100 text-purple-800 border-purple-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/booking');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      setUpdatingStatus(bookingId);
      const response = await fetch(`/api/booking/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh bookings to show updated status
        await fetchBookings();
        alert('Bokningsstatus uppdaterad!');
      } else {
        alert('Fel vid uppdatering av status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Fel vid uppdatering av status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Load bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bokningar</h1>
          <p className="text-muted-foreground">Laddar bokningar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Bokningar</h1>
          <p className="text-muted-foreground">Hantera och uppdatera bokningar med status och bokningsnummer.</p>
        </div>
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Laddar...' : 'Uppdatera'}
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-md border p-6 bg-white">
          <p className="text-sm text-muted-foreground">Inga bokningar hittades.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].map(status => {
              const count = bookings.filter(b => b.status === status).length;
              return (
                <div key={status} className="bg-white p-4 rounded-lg border">
                  <div className="text-sm font-medium text-gray-700">{getBookingStatusText(status)}</div>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto rounded-md border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Bokningsnr</th>
                  <th className="px-4 py-3 font-semibold">Kund</th>
                  <th className="px-4 py-3 font-semibold">Kontakt</th>
                  <th className="px-4 py-3 font-semibold">Tjänst</th>
                  <th className="px-4 py-3 font-semibold">Datum & Tid</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Pris</th>
                  <th className="px-4 py-3 font-semibold">Åtgärder</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const preferred = new Date(booking.preferredDate);
                  const dateTimeStr = preferred.toLocaleDateString('sv-SE') + 
                    (booking.preferredTime ? ` kl. ${booking.preferredTime}` : '');
                  
                  return (
                    <tr key={booking.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm">
                          {booking.bookingNumber || booking.id.slice(0, 8)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {booking.emailSent ? '✅ E-post skickad' : '⏳ E-post väntar'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-xs text-gray-500">
                          Skapad: {new Date(booking.createdAt).toLocaleDateString('sv-SE')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{booking.customerEmail}</div>
                        <div className="text-sm text-gray-800">{booking.customerPhone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{booking.service?.name ?? '-'}</div>
                        {booking.notes && (
                          <div className="text-xs text-gray-700 max-w-[200px] truncate" title={booking.notes}>
                            📝 {booking.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{dateTimeStr}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getBookingStatusColor(booking.status)}`}>
                          {getBookingStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {booking.finalPrice ? (
                          <div className="font-medium">{Number(booking.finalPrice)} SEK</div>
                        ) : booking.estimatedPrice ? (
                          <div className="text-sm text-gray-800">~{Number(booking.estimatedPrice)} SEK</div>
                        ) : (
                          <div className="text-sm text-gray-600">-</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={booking.status}
                          onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                          disabled={updatingStatus === booking.id}
                          className="text-sm border rounded px-2 py-1 bg-white"
                        >
                          <option value="PENDING">Väntande</option>
                          <option value="CONFIRMED">Bekräftad</option>
                          <option value="IN_PROGRESS">Pågående</option>
                          <option value="COMPLETED">Slutförd</option>
                          <option value="CANCELLED">Avbruten</option>
                        </select>
                        {updatingStatus === booking.id && (
                          <div className="text-xs text-blue-600 mt-1">Uppdaterar...</div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
