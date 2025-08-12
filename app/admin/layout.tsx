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
    <div className="page-container flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8 text-foreground">Adminpanel</h2>
        <nav className="flex flex-col space-y-2 flex-grow">
          <Link href="/admin/services" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            Tjänster
          </Link>
          <Link href="/admin/users" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            Användare
          </Link>
          <Link href="/admin/password-management" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            Lösenordshantering
          </Link>
          <Link href="/admin/pos" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            POS-system
          </Link>
          <Link href="/admin/bookings" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            Bokningar
          </Link>
          <Link href="/admin/promo-countdown" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            Kampanjer
          </Link>
          <Link href="/admin/whatsapp" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            WhatsApp
          </Link>
          <Link href="/admin/business-info" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            Företagsinfo
          </Link>
          <Link href="/admin/images" className="rounded px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
            Bilder
          </Link>
        </nav>
        <div className="mt-auto pt-4 border-t border-border">
          <SignOutButton />
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

