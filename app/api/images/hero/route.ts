import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Default fallback images for hero slider when no admin images are set
// Using reliable, working image URLs
const defaultHeroImages = [
  {
    id: 'default-1',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600&auto=format&fit=crop',
    alt: 'Skärmbyte samma dag',
    headline: 'Skärmbyte samma dag',
    sub: 'Premiumdelar, experttekniker, 6–12 mån garanti',
    cta: { label: 'Boka nu', href: '/booking' },
    section: 'HERO',
    position: 0,
    isActive: true,
    isDefault: true,
  },
  {
    id: 'default-2',
    url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1600&auto=format&fit=crop',
    alt: 'Batteribyte på 45 minuter',
    headline: 'Batteribyte på 45 minuter',
    sub: 'Håll din mobil som ny',
    cta: { label: 'Få offert', href: '/booking' },
    section: 'HERO',
    position: 1,
    isActive: true,
    isDefault: true,
  },
  {
    id: 'default-3',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1600&auto=format&fit=crop',
    alt: 'Vi kommer till dig',
    headline: 'Vi kommer till dig',
    sub: 'Reparation på plats i ditt område',
    cta: { label: 'Ring oss', href: 'tel:+46123456789' },
    section: 'HERO',
    position: 2,
    isActive: true,
    isDefault: true,
  },
];

// GET /api/images/hero - get hero slider images with fallbacks
export async function GET() {
  try {
    // Get admin-managed hero images
    const adminImages = await prisma.image.findMany({
      where: { 
        section: 'HERO',
        isActive: true 
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });

    // If admin has set hero images, use those
    if (adminImages.length > 0) {
      // Transform admin images to include hero-specific fields
      const heroImages = adminImages.map(img => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        headline: img.alt, // Use alt text as headline if no specific headline field
        sub: img.creditName || 'Professionell mobilreparation',
        cta: { label: 'Boka nu', href: '/booking' },
        section: img.section,
        position: img.position,
        isActive: img.isActive,
        isDefault: false,
        creditName: img.creditName,
        creditUrl: img.creditUrl,
      }));
      
      return NextResponse.json(heroImages);
    }

    // Fallback to default images if no admin images are set
    return NextResponse.json(defaultHeroImages);
    
  } catch (e) {
    console.error('GET /api/images/hero error', e);
    // Return default images on error to ensure hero slider always works
    return NextResponse.json(defaultHeroImages);
  }
}
