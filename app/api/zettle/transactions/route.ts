import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ZettleAPIService } from '@/lib/zettle-api';

// GET /api/zettle/transactions - Get transaction history from Zettle
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;

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
      console.log('Starting Zettle authentication for transactions...');
      // Authenticate and get transactions
      await zettleService.authenticate();
      console.log('Authentication successful, fetching transactions...');
      
      const transactions = await zettleService.getPurchases(startDate, endDate, limit);
      console.log(`Successfully fetched ${transactions.length} transactions from Zettle`);
      
      return NextResponse.json({
        transactions,
        count: transactions.length,
        message: 'Transaktioner hämtade från Zettle'
      });
    } catch (error: any) {
      console.error('Zettle transactions API error:', error);
      console.error('Error stack:', error.stack);
      return NextResponse.json(
        { error: 'Kunde inte hämta transaktioner från Zettle: ' + error.message },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Zettle transactions GET error:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod vid hämtning av Zettle-transaktioner' },
      { status: 500 }
    );
  }
}
