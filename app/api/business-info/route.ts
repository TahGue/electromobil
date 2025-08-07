import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic'; // Defaults to auto

// GET business info
export async function GET() {
  try {
    let info = await prisma.businessInfo.findFirst();
    // If no info exists, create a default one
    if (!info) {
      info = await prisma.businessInfo.create({
        data: {
          name: 'TechFix Mobile',
          address: '123 Tech St, Digital City, USA',
          phone: '(555) 123-4567',
          email: 'info@techfixmobile.com',
          hours: {},
          socialLinks: {},
        },
      });
    }
    return NextResponse.json(info);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to fetch business info', { status: 500 });
  }
}

// UPDATE business info
export async function PUT(req: Request) {
  console.log('--- Received PUT request to /api/business-info ---');
  try {
    const body = await req.json();
    console.log('Request Body:', body);

    const { id, hours, socialLinks, ...rest } = body;

    let parsedHours = hours;
    let parsedSocialLinks = socialLinks;

    try {
      if (hours && typeof hours === 'string') {
        parsedHours = JSON.parse(hours);
      }
      if (socialLinks && typeof socialLinks === 'string') {
        parsedSocialLinks = JSON.parse(socialLinks);
      }
    } catch (e: any) {
      console.error('JSON Parsing Error:', e.message);
      return new NextResponse(`Invalid JSON format: ${e.message}`, { status: 400 });
    }

    const dataForUpdate = {
      ...rest,
      hours: parsedHours,
      socialLinks: parsedSocialLinks,
    };

    console.log('Data being sent to Prisma:', dataForUpdate);

    const updatedInfo = await prisma.businessInfo.update({
      where: { id: id },
      data: dataForUpdate,
    });

    console.log('Prisma update successful. Updated Info:', updatedInfo);
    console.log('Updated business info:', updatedInfo);
    revalidatePath('/'); // Revalidate the entire site
    console.log('Cache revalidated for path: /');
    console.log('PUT request successfully processed.');
    return NextResponse.json(updatedInfo);

  } catch (error: any) {
    console.error('--- ERROR in PUT /api/business-info ---');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    return new NextResponse('Failed to update business info', { status: 500 });
  }
}
