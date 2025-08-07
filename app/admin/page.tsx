import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to the Admin Dashboard</h1>
      <ul className="space-y-4">
        <li><Link href="/admin/bookings" className="text-blue-600 hover:underline">Manage Bookings</Link></li>
        <li><Link href="/admin/services" className="text-blue-600 hover:underline">Manage Services</Link></li>
        <li><Link href="/admin/users" className="text-blue-600 hover:underline">Manage Users</Link></li>
        <li><Link href="/admin/business-info" className="text-blue-600 hover:underline">Business Info</Link></li>
      </ul>
    </div>
  );
}
