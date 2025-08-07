import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return new NextResponse('An internal server error occurred.', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, duration, category, isActive } = body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        category,
        isActive,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to create service', { status: 500 });
  }
}
