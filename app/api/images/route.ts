import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/images - list images (optionally filter by section)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section') as any;
  try {
    const images = await prisma.image.findMany({
      where: section ? { section } : undefined,
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(images);
  } catch (e) {
    console.error('GET /api/images error', e);
    return NextResponse.json({ message: 'Kunde inte hämta bilder' }, { status: 500 });
  }
}

// POST /api/images - create new image
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, alt, section, creditName, creditUrl, position, isActive } = body;
    if (!url || !alt || !section) {
      return NextResponse.json({ message: 'url, alt och section krävs' }, { status: 400 });
    }
    const created = await prisma.image.create({
      data: {
        url,
        alt,
        section,
        creditName: creditName || null,
        creditUrl: creditUrl || null,
        position: typeof position === 'number' ? position : 0,
        isActive: typeof isActive === 'boolean' ? isActive : true,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('POST /api/images error', e);
    return NextResponse.json({ message: 'Kunde inte skapa bild' }, { status: 500 });
  }
}
