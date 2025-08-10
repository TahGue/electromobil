import 'server-only';

import { prisma } from '@/lib/prisma';
import { cache } from 'react';

/**
 * Fetches the business information from the database.
 * Uses React's `cache` to deduplicate requests across components.
 */
export const getBusinessInfo = cache(async () => {
  console.log('Fetching business info...');
  // If DATABASE_URL is not defined (e.g., build time on Vercel),
  // avoid initializing Prisma and return safe defaults.
  if (!process.env.DATABASE_URL) {
    return {
      id: '',
      name: 'TechFix Mobile',
      address: '123 Tech St, Digital City, USA',
      phone: '(555) 123-4567',
      email: 'info@techfixmobile.com',
      hours: {},
      socialLinks: { facebook: '#', twitter: '#', instagram: '#' },
    };
  }

  let info = null as any;
  try {
    info = await prisma.businessInfo.findFirst();
  } catch (err) {
    console.error('prisma:error getBusinessInfo', err);
  }

  // Provide default info if none is found in the database
  return info || {
    id: '',
    name: 'TechFix Mobile',
    address: '123 Tech St, Digital City, USA',
    phone: '(555) 123-4567',
    email: 'info@techfixmobile.com',
    hours: {},
    socialLinks: { facebook: '#', twitter: '#', instagram: '#' },
  };
});
