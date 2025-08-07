'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete service');
      setServices((prev) => prev.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <Link href="/admin/services/new">
          <Button variant="primary">Add Service</Button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Active</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-2 border">{s.name}</td>
                <td className="px-4 py-2 border">${Number(s.price).toFixed(2)}</td>
                <td className="px-4 py-2 border">{s.category}</td>
                <td className="px-4 py-2 border">{s.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border space-x-2">
                  <Link href={`/admin/services/${s.id}/edit`}><Button variant="outline">Edit</Button></Link>
                  <Button variant="outline" onClick={() => handleDelete(s.id)} className="text-red-600">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
