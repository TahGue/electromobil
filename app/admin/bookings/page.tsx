'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string;
  status: string;
  service: { name: string };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/booking');
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to update status');
      setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      const res = await fetch(`/api/booking/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete booking');
      setBookings((prev) => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Service</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-2 border">{b.customerName}</td>
                <td className="px-4 py-2 border">{b.customerEmail}</td>
                <td className="px-4 py-2 border">{b.customerPhone}</td>
                <td className="px-4 py-2 border">{b.service?.name}</td>
                <td className="px-4 py-2 border">{new Date(b.preferredDate).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">
                  <select
                    value={b.status}
                    onChange={e => handleStatusChange(b.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-2 border">
                  <Button variant="outline" onClick={() => handleDelete(b.id)} className="text-red-600">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
