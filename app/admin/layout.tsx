import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton } from '@/components/auth/auth-buttons';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8">Adminpanel</h2>
        <nav className="flex flex-col space-y-2 flex-grow">
          <Link href="/admin/services" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">Tjänster</Link>
          <Link href="/admin/users" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">Användare</Link>
          <Link href="/admin/password-management" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">Lösenordshantering</Link>
          <Link href="/admin/pos" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">POS-system</Link>
          <Link href="/admin/bookings" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">Bokningar</Link>
          <Link href="/admin/promo-countdown" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">Kampanjer</Link>
          <Link href="/admin/whatsapp" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">WhatsApp</Link>
          <Link href="/admin/business-info" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">Företagsinfo</Link>
          <Link href="/admin/images" className="rounded px-3 py-2 text-gray-200 hover:text-white hover:bg-gray-800">Bilder</Link>
          {/* Lägg till fler adminlänkar här */}
        </nav>
        <div className="mt-auto">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-50 text-gray-900">{children}</main>
    </div>
  );
}

