import 'server-only';

import { prisma } from '@/lib/prisma';
import { cache } from 'react';

/**
 * Fetches the business information from the database.
 * Uses React's `cache` to deduplicate requests across components.
 */
export const getBusinessInfo = cache(async () => {
  console.log('Fetching business info...');
  const info = await prisma.businessInfo.findFirst();

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
