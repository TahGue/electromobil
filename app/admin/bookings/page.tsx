import React from 'react';

// Enkel typ baserad på API-svaret från GET /api/booking
interface BookingItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredDate: string; // ISO
  createdAt: string; // ISO
  notes?: string | null;
  service?: { name: string } | null;
}

async function getBookings(): Promise<BookingItem[]> {
  try {
    // Server-komponent: hämta direkt från API-routen
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/booking`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      console.error('Misslyckades att hämta bokningar', res.status);
      return [];
    }
    return await res.json();
  } catch (e) {
    console.error('Fel vid hämtning av bokningar', e);
    return [];
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bokningar</h1>
        <p className="text-muted-foreground">Översikt över inkomna bokningar.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-md border p-6 bg-white">
          <p className="text-sm text-muted-foreground">Inga bokningar hittades.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 font-semibold">Kund</th>
                <th className="px-4 py-2 font-semibold">E-post</th>
                <th className="px-4 py-2 font-semibold">Telefon</th>
                <th className="px-4 py-2 font-semibold">Tjänst</th>
                <th className="px-4 py-2 font-semibold">Önskat datum</th>
                <th className="px-4 py-2 font-semibold">Skapad</th>
                <th className="px-4 py-2 font-semibold">Anteckningar</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const preferred = new Date(b.preferredDate);
                const created = new Date(b.createdAt);
                return (
                  <tr key={b.id} className="border-t">
                    <td className="px-4 py-2">{b.customerName}</td>
                    <td className="px-4 py-2">{b.customerEmail}</td>
                    <td className="px-4 py-2">{b.customerPhone}</td>
                    <td className="px-4 py-2">{b.service?.name ?? '-'}</td>
                    <td className="px-4 py-2">{preferred.toLocaleString('sv-SE')}</td>
                    <td className="px-4 py-2">{created.toLocaleString('sv-SE')}</td>
                    <td className="px-4 py-2 max-w-[300px] truncate" title={b.notes ?? ''}>{b.notes ?? '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
