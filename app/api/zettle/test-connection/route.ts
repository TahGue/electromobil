import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ZettleAPIService } from '@/lib/zettle-api';

export const dynamic = 'force-dynamic';

// GET /api/zettle/test-connection - Test Zettle connection with env credentials
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Check if environment variables are configured (either OAuth or API Key)
    const hasOAuthCredentials = !!(process.env.ZETTLE_CLIENT_ID && process.env.ZETTLE_CLIENT_SECRET);
    const hasApiKey = !!process.env.ZETTLE_API_KEY;
    const isConfigured = hasOAuthCredentials || hasApiKey;
    
    if (!isConfigured) {
      return NextResponse.json(
        { 
          isConfigured: false,
          error: 'Zettle API-uppgifter saknas i miljövariabler',
          details: 'Kontrollera att antingen ZETTLE_CLIENT_ID + ZETTLE_CLIENT_SECRET eller ZETTLE_API_KEY är konfigurerade i .env-filen',
          environment: process.env.ZETTLE_ENVIRONMENT || 'sandbox',
          currency: process.env.ZETTLE_CURRENCY || 'SEK',
          country: process.env.ZETTLE_COUNTRY || 'SE',
          authMethod: hasApiKey ? 'apikey' : 'oauth',
          configured: {
            clientId: !!process.env.ZETTLE_CLIENT_ID,
            clientSecret: !!process.env.ZETTLE_CLIENT_SECRET,
            apiKey: !!process.env.ZETTLE_API_KEY,
            apiUrl: !!process.env.ZETTLE_API_URL,
            environment: !!process.env.ZETTLE_ENVIRONMENT,
            currency: !!process.env.ZETTLE_CURRENCY,
            country: !!process.env.ZETTLE_COUNTRY
          }
        },
        { status: 200 }
      );
    }

    // Test actual connection
    try {
      // Determine authentication method
      const authMethod = hasApiKey ? 'apikey' : 'oauth';
      
      const zettleService = new ZettleAPIService({
        clientId: process.env.ZETTLE_CLIENT_ID,
        clientSecret: process.env.ZETTLE_CLIENT_SECRET,
        apiKey: process.env.ZETTLE_API_KEY,
        authMethod: authMethod,
        apiUrl: process.env.ZETTLE_API_URL || 'https://oauth.zettle.com',
        environment: (process.env.ZETTLE_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
        currency: process.env.ZETTLE_CURRENCY || 'SEK',
        country: process.env.ZETTLE_COUNTRY || 'SE',
        locale: process.env.ZETTLE_LOCALE || 'sv-SE'
      });

      // Test authentication
      await zettleService.authenticate();
      
      return NextResponse.json({
        isConfigured: true,
        message: 'Zettle-konfiguration verifierad och anslutning lyckades',
        status: 'ready',
        environment: process.env.ZETTLE_ENVIRONMENT || 'sandbox',
        currency: process.env.ZETTLE_CURRENCY || 'SEK',
        country: process.env.ZETTLE_COUNTRY || 'SE',
        locale: process.env.ZETTLE_LOCALE || 'sv-SE'
      });
    } catch (authError: any) {
      return NextResponse.json(
        { 
          isConfigured: false,
          error: 'Zettle-autentisering misslyckades',
          details: authError.message,
          environment: process.env.ZETTLE_ENVIRONMENT || 'sandbox',
          currency: process.env.ZETTLE_CURRENCY || 'SEK',
          country: process.env.ZETTLE_COUNTRY || 'SE'
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Zettle connection test error:', error);
    return NextResponse.json(
      { 
        isConfigured: false,
        error: 'Ett fel uppstod vid test av Zettle-anslutning',
        details: error instanceof Error ? error.message : 'Okänt fel'
      },
      { status: 500 }
    );
  }
}
