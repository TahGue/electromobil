import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ZettleAPIService } from '@/lib/zettle-api';
import { prisma } from '@/lib/prisma';

// GET /api/zettle/products - Get products from Zettle
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Determine authentication method
    const authMethod = process.env.ZETTLE_API_KEY ? 'apikey' : 'oauth';
    
    // Initialize Zettle API service
    const zettleService = new ZettleAPIService({
      clientId: process.env.ZETTLE_CLIENT_ID,
      clientSecret: process.env.ZETTLE_CLIENT_SECRET,
      apiKey: process.env.ZETTLE_API_KEY,
      authMethod: authMethod as 'oauth' | 'apikey',
      apiUrl: process.env.ZETTLE_API_URL || 'https://oauth.izettle.com',
      environment: (process.env.ZETTLE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
      currency: process.env.ZETTLE_CURRENCY || 'SEK',
      country: process.env.ZETTLE_COUNTRY || 'SE',
      locale: process.env.ZETTLE_LOCALE || 'sv-SE'
    });
    
    try {
      console.log('Starting Zettle authentication...');
      // Authenticate and get products
      await zettleService.authenticate();
      console.log('Authentication successful, fetching products...');
      
      const products = await zettleService.getProducts();
      console.log(`Successfully fetched ${products.length} products from Zettle`);
      
      return NextResponse.json({
        products,
        count: products.length,
        message: 'Produkter hämtade från Zettle'
      });
    } catch (error: any) {
      console.error('Zettle products API error:', error);
      console.error('Error stack:', error.stack);
      return NextResponse.json(
        { error: 'Kunde inte hämta produkter från Zettle: ' + error.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Zettle products GET error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod vid hämtning av Zettle-produkter' },
      { status: 500 }
    );
  }
}

// POST /api/zettle/products - Sync local services with Zettle products
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === 'sync') {
      // Get local services to sync with Zettle
      const localServices = await prisma.service.findMany({
        where: { isActive: true }
      });

      // Determine authentication method
      const authMethod = process.env.ZETTLE_API_KEY ? 'apikey' : 'oauth';
      
      // Initialize Zettle API service
      const zettleService = new ZettleAPIService({
        clientId: process.env.ZETTLE_CLIENT_ID,
        clientSecret: process.env.ZETTLE_CLIENT_SECRET,
        apiKey: process.env.ZETTLE_API_KEY,
        authMethod: authMethod as 'oauth' | 'apikey',
        apiUrl: process.env.ZETTLE_API_URL || 'https://oauth.izettle.com',
        environment: (process.env.ZETTLE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
        currency: process.env.ZETTLE_CURRENCY || 'SEK',
        country: process.env.ZETTLE_COUNTRY || 'SE',
        locale: process.env.ZETTLE_LOCALE || 'sv-SE'
      });
      
      try {
        // Authenticate and sync products
        await zettleService.authenticate();
        const syncResult = await zettleService.syncProducts(localServices);
        
        return NextResponse.json({
          message: 'Synkronisering med Zettle slutförd',
          result: syncResult
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Synkronisering misslyckades: ' + error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Ogiltig åtgärd' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Zettle products POST error:', error);
    return NextResponse.json(
      { message: 'Ett fel uppstod vid synkronisering' },
      { status: 500 }
    );
  }
}
