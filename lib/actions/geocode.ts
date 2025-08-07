'use server';

import { unstable_cache as cache } from 'next/cache';

interface GeocodeResult {
  lat: string;
  lon: string;
}

/**
 * Geocodes an address string to latitude and longitude using the free Nominatim API.
 * Caches the result to avoid repeated lookups for the same address.
 */
export const geocodeAddress = cache(
  async (address: string): Promise<{ lat: number; lng: number } | null> => {
    console.log(`Geocoding address: ${address}`);
    if (!address) return null;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mobile Repair Shop Website - Contact Page',
        },
      });

      if (!response.ok) {
        console.error('Geocoding API request failed:', response.statusText);
        return null;
      }

      const data: GeocodeResult[] = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        console.log(`Geocoding successful: Lat: ${lat}, Lng: ${lon}`);
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      }

      console.warn('Geocoding found no results for address.');
      return null;
    } catch (error) {
      console.error('An error occurred during geocoding:', error);
      return null;
    }
  },
  ['geocode-address'], // Cache key prefix
  { revalidate: 3600 * 24 } // Revalidate once a day
);
