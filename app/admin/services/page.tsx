'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  isActive: boolean;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error('Failed to fetch services');
        const data = await res.json();
        setServices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Är du säker på att du vill ta bort den här tjänsten?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      setServices((prev) => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Laddar tjänster...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Hantera Tjänster</h1>
        <Link href="/admin/services/new">
          <Button variant="primary">Lägg till Tjänst</Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Namn</th>
              <th className="px-4 py-2 border">Pris</th>
              <th className="px-4 py-2 border">Kategori</th>
              <th className="px-4 py-2 border">Aktiv</th>
              <th className="px-4 py-2 border">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2 border">{s.name}</td>
                <td className="px-4 py-2 border">{formatPrice(s.price)}</td>
                <td className="px-4 py-2 border">{s.category}</td>
                <td className="px-4 py-2 border">{s.isActive ? 'Ja' : 'Nej'}</td>
                <td className="px-4 py-2 border space-x-2">
                  <Link href={`/admin/services/${s.id}/edit`}><Button variant="outline">Redigera</Button></Link>
                  <Button variant="outline" onClick={() => handleDelete(s.id)} className="text-red-600">Ta bort</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
