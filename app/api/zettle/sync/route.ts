import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createZettleService } from '@/lib/zettle-api';
import { prisma } from '@/lib/prisma';

// POST /api/zettle/sync - Comprehensive sync between Zettle POS and webapp services
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { direction, username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { message: 'Zettle-inloggningsuppgifter krävs för synkronisering' },
        { status: 400 }
      );
    }

    const zettleService = createZettleService();
    
    try {
      // Authenticate with Zettle using stored OAuth tokens
      await zettleService.authenticate();
      
      let syncResult;
      
      switch (direction) {
        case 'from_zettle':
          syncResult = await syncFromZettleToServices(zettleService);
          break;
        case 'to_zettle':
          syncResult = await syncFromServicesToZettle(zettleService);
          break;
        case 'bidirectional':
          const fromZettle = await syncFromZettleToServices(zettleService);
          const toZettle = await syncFromServicesToZettle(zettleService);
          syncResult = {
            fromZettle,
            toZettle,
            message: 'Bidirektionell synkronisering slutförd'
          };
          break;
        default:
          throw new Error('Ogiltig synkroniseringsriktning');
      }

      return NextResponse.json({
        message: 'Synkronisering slutförd framgångsrikt',
        result: syncResult
      });

    } catch (error: any) {
      return NextResponse.json(
        { message: 'Synkronisering misslyckades: ' + error.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Zettle sync error:', error);
    return NextResponse.json(
      { message: 'Ett fel uppstod vid synkronisering' },
      { status: 500 }
    );
  }
}

// Sync Zettle products TO webapp services
async function syncFromZettleToServices(zettleService: any) {
  const results = {
    fetched: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [] as string[]
  };

  try {
    // Fetch all products from Zettle
    const zettleProducts = await zettleService.getProducts();
    results.fetched = zettleProducts.length;

    // Get existing services for comparison
    const existingServices = await prisma.service.findMany();
    const serviceMap = new Map(existingServices.map(s => [s.zettleProductId, s]));

    for (const product of zettleProducts) {
      try {
        const existingService = serviceMap.get(product.uuid);
        
        // Convert Zettle product to service format
        const serviceData = {
          name: product.name,
          description: product.description || '',
          price: product.price.amount / 100, // Convert from öre to SEK
          duration: 60, // Default 60 minutes for imported services
          category: mapZettleCategoryToServiceCategory(product.category?.name),
          isActive: true,
          zettleProductId: product.uuid,
          zettleEtag: product.etag,
          lastSyncedAt: new Date(),
        };

        if (existingService) {
          // Update existing service
          await prisma.service.update({
            where: { id: existingService.id },
            data: serviceData,
          });
          results.updated++;
        } else {
          // Create new service
          await prisma.service.create({
            data: serviceData,
          });
          results.created++;
        }
      } catch (error: any) {
        results.errors.push(`Fel vid synkronisering av produkt ${product.name}: ${error.message}`);
        results.skipped++;
      }
    }

    // Mark services as inactive if they no longer exist in Zettle
    const zettleProductIds = new Set(zettleProducts.map(p => p.uuid));
    const servicesToDeactivate = existingServices.filter(s => 
      s.zettleProductId && !zettleProductIds.has(s.zettleProductId)
    );

    for (const service of servicesToDeactivate) {
      await prisma.service.update({
        where: { id: service.id },
        data: { isActive: false, lastSyncedAt: new Date() },
      });
    }

  } catch (error: any) {
    results.errors.push(`Allmänt synkroniseringsfel: ${error.message}`);
  }

  return results;
}

// Sync webapp services TO Zettle products
async function syncFromServicesToZettle(zettleService: any) {
  const results = {
    fetched: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [] as string[]
  };

  try {
    // Get active services from webapp
    const services = await prisma.service.findMany({
      where: { isActive: true }
    });
    results.fetched = services.length;

    // Get existing Zettle products for comparison
    const zettleProducts = await zettleService.getProducts();
    const zettleProductMap = new Map(zettleProducts.map(p => [p.externalReference, p]));

    for (const service of services) {
      try {
        const existingProduct = service.zettleProductId 
          ? zettleProducts.find(p => p.uuid === service.zettleProductId)
          : zettleProductMap.get(service.id);

        // Convert service to Zettle product format
        const productData = {
          name: service.name,
          description: service.description || '',
          price: {
            amount: Math.round((Number(service.price) || 0) * 100), // Convert SEK to öre
            currencyId: 'SEK',
          },
          externalReference: service.id,
          unitName: 'st',
          category: mapServiceCategoryToZettleCategory(service.category),
        };

        if (existingProduct) {
          // Update existing product
          await zettleService.updateProduct(existingProduct.uuid, productData, existingProduct.etag);
          
          // Update service with Zettle info
          await prisma.service.update({
            where: { id: service.id },
            data: {
              zettleProductId: existingProduct.uuid,
              lastSyncedAt: new Date(),
            },
          });
          results.updated++;
        } else {
          // Create new product
          const newProduct = await zettleService.createProduct(productData);
          
          // Update service with new Zettle product ID
          await prisma.service.update({
            where: { id: service.id },
            data: {
              zettleProductId: newProduct.uuid,
              zettleEtag: newProduct.etag,
              lastSyncedAt: new Date(),
            },
          });
          results.created++;
        }
      } catch (error: any) {
        results.errors.push(`Fel vid synkronisering av tjänst ${service.name}: ${error.message}`);
        results.skipped++;
      }
    }

  } catch (error: any) {
    results.errors.push(`Allmänt synkroniseringsfel: ${error.message}`);
  }

  return results;
}

// Helper function to map Zettle categories to service categories
function mapZettleCategoryToServiceCategory(zettleCategory?: string): string {
  if (!zettleCategory) return 'Övrigt';
  
  const categoryMap: { [key: string]: string } = {
    'Screen Repair': 'Skärmreparation',
    'Battery': 'Batteribyte',
    'Water Damage': 'Vattenskada',
    'Software': 'Mjukvara',
    'Hardware': 'Hårdvara',
    'Accessories': 'Tillbehör',
    'Other': 'Övrigt',
  };

  return categoryMap[zettleCategory] || zettleCategory;
}

// Helper function to map service categories to Zettle categories
function mapServiceCategoryToZettleCategory(serviceCategory: string): any {
  const categoryMap: { [key: string]: any } = {
    'Skärmreparation': { name: 'Screen Repair' },
    'Batteribyte': { name: 'Battery' },
    'Vattenskada': { name: 'Water Damage' },
    'Mjukvara': { name: 'Software' },
    'Hårdvara': { name: 'Hardware' },
    'Tillbehör': { name: 'Accessories' },
    'Övrigt': { name: 'Other' },
  };

  return categoryMap[serviceCategory] || { name: 'Other' };
}
