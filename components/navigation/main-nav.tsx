'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  // Customer navigation: single-page anchors
  const routes = [
    { href: '/', label: 'Hem' },
    { href: '/#services', label: 'Tjänster' },
    { href: '/#work', label: 'Före/Efter' },
    { href: '/#reviews', label: 'Omdömen' },
    { href: '/booking', label: 'Boka Nu' },
    { href: '/#contact', label: 'Kontakt' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              TechFix Mobile
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => {
              const isHash = route.href.includes('#');
              const isActive = !isHash && pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    'transition-colors hover:text-foreground/80',
                    isActive ? 'text-foreground' : 'text-foreground/60'
                  )}
                >
                  {route.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {status === 'loading' ? (
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            ) : session ? (
              <div className="relative group">
                <Button variant="secondary" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {session.user.name}
                </Button>
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                  <div className="py-1">
                    {isAdmin && (
                      <Link href="/admin/dashboard">
                        <span className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
  Adminpanel
                        </span>
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-muted"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
  Logga ut
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/signin">
      <Button>Logga in</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
