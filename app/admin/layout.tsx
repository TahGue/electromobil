import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin/bookings" className="hover:bg-gray-800 rounded px-3 py-2">Bookings</Link>
          <Link href="/admin/services" className="hover:bg-gray-800 rounded px-3 py-2">Services</Link>
          <Link href="/admin/users" className="hover:bg-gray-800 rounded px-3 py-2">Users</Link>
          <Link href="/admin/business-info" className="hover:bg-gray-800 rounded px-3 py-2">Business Info</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
