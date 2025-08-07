import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single service
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const service = await prisma.service.findUnique({
      where: { id },
    });
    if (!service) {
      return new NextResponse('Service not found', { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to fetch service', { status: 500 });
  }
}

// UPDATE a service
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, price, category, isActive } = body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: { name, price: Number(price), category, isActive },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to update service', { status: 500 });
  }
}

// DELETE a service
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.service.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to delete service', { status: 500 });
  }
}
