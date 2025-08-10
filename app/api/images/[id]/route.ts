import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/images/[id] - update image
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await _req.json();
    const updated = await prisma.image.update({
      where: { id: params.id },
      data: {
        url: body.url,
        alt: body.alt,
        section: body.section,
        creditName: body.creditName,
        creditUrl: body.creditUrl,
        position: body.position,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('PATCH /api/images/[id] error', e);
    return NextResponse.json({ message: 'Kunde inte uppdatera bild' }, { status: 500 });
  }
}

// DELETE /api/images/[id] - delete image
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.image.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /api/images/[id] error', e);
    return NextResponse.json({ message: 'Kunde inte ta bort bild' }, { status: 500 });
  }
}
