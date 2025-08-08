'use client';

import { signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function SignInButton() {
  return <Button onClick={() => signIn()}>Sign In</Button>;
}

export function SignOutButton() {
  return (
    <Button 
      variant="outline"
      className="w-full text-white border-gray-600 hover:bg-gray-800 hover:text-white"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Sign Out
    </Button>
  );
}
