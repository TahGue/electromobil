'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The sign in link is no longer valid or has expired.',
    Default: 'An error occurred during sign in. Please try again.',
  };

  const errorMessage = error && error in errorMessages
    ? errorMessages[error as keyof typeof errorMessages]
    : errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/auth/signin">
            <Button variant="outline" className="px-8">
              Back to Sign In
            </Button>
          </Link>
          <Link href="/" className="ml-4">
            <Button className="px-8">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthError />
    </Suspense>
  );
}
