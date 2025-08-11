'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { 
  CreditCard, 
  RotateCcw, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

interface ZettleProduct {
  uuid: string;
  name: string;
  description?: string;
  price: {
    amount: number;
    currencyId: string;
  };
  externalReference?: string;
  updatedAt?: string;
}

interface ZettleTransaction {
  uuid: string;
  amount: number;
  currencyId: string;
  timestamp: string;
  reference?: string;
  description?: string;
  status: string;
  paymentMethod: string;
}

export default function POSManagementPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);
  
  const [products, setProducts] = useState<ZettleProduct[]>([]);
  const [transactions, setTransactions] = useState<ZettleTransaction[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [stats, setStats] = useState({
    totalProducts: 0,
    recentTransactions: 0,
    totalRevenue: 0,
    lastSync: null as string | null,
  });

  // Check OAuth connection status and configuration on load
  useEffect(() => {
    const checkZettleConfiguration = async () => {
      try {
        // Check OAuth configuration directly
        const oauthResponse = await fetch('/api/zettle/oauth/debug');
        const oauthResult = await oauthResponse.json();
        
        if (oauthResponse.ok && oauthResult.success && oauthResult.debug.clientId === 'SET') {
          // Check if we have OAuth connection by testing authentication
          try {
            const authResponse = await fetch('/api/zettle/auth', { method: 'POST' });
            const authResult = await authResponse.json();
            
            if (authResponse.ok && authResult.connected) {
              // OAuth connection is active
              setConfigStatus({
                isConfigured: true,
                environment: 'production',
                currency: 'SEK',
                country: 'SE',
                connected: true
              });
              setIsAuthenticated(true);
              toast({
                title: 'Zettle OAuth-anslutning aktiv',
                description: `Miljö: production`,
              });
              // Load data if connected
              loadProducts();
              loadTransactions();
            } else {
              // No OAuth connection or expired
              setConfigStatus({
                isConfigured: true,
                environment: 'production',
                currency: 'SEK',
                country: 'SE',
                connected: false,
                needsConnection: true
              });
              toast({
                title: 'Zettle redo för anslutning',
                description: 'Klicka på "Anslut till Zettle OAuth" för att börja',
              });
            }
          } catch (authError) {
            // Auth check failed, show connection needed
            setConfigStatus({
              isConfigured: true,
              environment: 'production',
              currency: 'SEK',
              country: 'SE',
              connected: false,
              needsConnection: true
            });
          }
        } else {
          setConfigStatus({
            isConfigured: false,
            connected: false,
            error: 'Zettle OAuth-konfiguration saknas'
          });
          toast({
            title: 'Konfigurationsfel',
            description: 'Kontrollera Zettle OAuth-inställningar',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Configuration check failed:', error);
        setConfigStatus({
          isConfigured: false,
          error: 'Kunde inte kontrollera konfiguration',
          details: error instanceof Error ? error.message : 'Okänt fel'
        });
        toast({
          title: 'Anslutningsfel',
          description: 'Kunde inte kontrollera Zettle-konfiguration',
          variant: 'destructive',
        });
      }
    };
    
    // Check for OAuth callback success/error in URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('zettle_connected')) {
      toast({
        title: 'Zettle ansluten!',
        description: 'OAuth-autentisering lyckades',
      });
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('zettle_error')) {
      const error = urlParams.get('zettle_error');
      toast({
        title: 'Zettle-anslutningsfel',
        description: `OAuth-fel: ${error}`,
        variant: 'destructive',
      });
      // Remove the parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    checkZettleConfiguration();
  }, [toast]);

  const handleConnectToZettle = () => {
    // Redirect to OAuth start endpoint
    window.location.href = '/api/zettle/oauth/start';
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/zettle/auth', { method: 'POST' });
      const result = await response.json();
      
      if (response.ok && result.connected) {
        setIsAuthenticated(true);
        setConfigStatus(prev => ({ ...prev, connected: true }));
        toast({
          title: 'Zettle OAuth-anslutning aktiv',
          description: 'Anslutningen fungerar korrekt',
        });
        // Load initial data if connected
        loadProducts();
        loadTransactions();
      } else {
        setIsAuthenticated(false);
        setConfigStatus(prev => ({ ...prev, connected: false, needsConnection: true }));
        toast({
          title: 'Zettle-anslutning krävs',
          description: result.message || 'Anslut till Zettle OAuth för att fortsätta',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Connection status check failed:', error);
      setIsAuthenticated(false);
      setConfigStatus(prev => ({ ...prev, connected: false, needsConnection: true }));
      toast({
        title: 'Anslutningsfel',
        description: 'Kunde inte kontrollera Zettle-anslutning',
        variant: 'destructive',
      });
    }
  };

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch('/api/zettle/products');
      const result = await response.json();

      if (response.ok) {
        setProducts(result.products || []);
        setStats(prev => ({ ...prev, totalProducts: result.count || 0 }));
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: 'Kunde inte hämta produkter: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const response = await fetch('/api/zettle/transactions');
      const result = await response.json();

      if (response.ok) {
        setTransactions(result.transactions || []);
        
        // Calculate stats
        const recentTransactions = result.transactions?.length || 0;
        const totalRevenue = result.transactions?.reduce((sum: number, t: ZettleTransaction) => 
          sum + (t.amount / 100), 0) || 0; // Convert from öre to SEK
        
        setStats(prev => ({ 
          ...prev, 
          recentTransactions,
          totalRevenue,
          lastSync: new Date().toISOString()
        }));
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: 'Fel',
        description: 'Kunde inte hämta transaktioner: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleSyncProducts = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/zettle/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Synkronisering slutförd!',
          description: `Skapade: ${result.result.created}, Uppdaterade: ${result.result.updated}`,
        });
        
        // Reload products after sync
        loadProducts();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: 'Synkroniseringsfel',
        description: error.message || 'Kunde inte synkronisera produkter',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'SEK') => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100); // Convert from öre to SEK
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('sv-SE');
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-8 max-w-2xl">
        <div className="text-center mb-8">
          <CreditCard className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Zettle POS Integration</h1>
          <p className="text-gray-600">
            Anslut till ditt iZettle/Zettle POS-system för att synkronisera produkter och transaktioner
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Anslut till Zettle</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Automatisk autentisering</span>
              </div>
              <p className="text-sm text-blue-700">
                Anslutningen använder dina API-nycklar från miljövariabler (Client ID och Secret) 
                för säker autentisering utan att behöva ange användaruppgifter.
              </p>
            </div>

            {configStatus && (
              <div className={`border rounded-lg p-4 ${
                configStatus.isConfigured 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {configStatus.isConfigured ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    configStatus.isConfigured ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {configStatus.isConfigured ? 'Konfiguration OK' : 'Konfigurationsproblem'}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <p className={configStatus.isConfigured ? 'text-green-700' : 'text-red-700'}>
                    <strong>Miljö:</strong> {configStatus.environment || 'Ej konfigurerad'}
                  </p>
                  <p className={configStatus.isConfigured ? 'text-green-700' : 'text-red-700'}>
                    <strong>Valuta:</strong> {configStatus.currency || 'Ej konfigurerad'}
                  </p>
                  <p className={configStatus.isConfigured ? 'text-green-700' : 'text-red-700'}>
                    <strong>Land:</strong> {configStatus.country || 'Ej konfigurerad'}
                  </p>
                  {configStatus.error && (
                    <p className="text-red-700 mt-2">
                      <strong>Fel:</strong> {configStatus.error}
                    </p>
                  )}
                </div>
              </div>
            )}

            {configStatus?.connected ? (
              <div className="space-y-2">
                <Button 
                  onClick={checkConnectionStatus} 
                  disabled={isAuthenticating}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera anslutningsstatus
                </Button>
                <Button 
                  onClick={handleConnectToZettle} 
                  disabled={isAuthenticating}
                  className="w-full"
                  variant="secondary"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Återanslut till Zettle
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleConnectToZettle} 
                disabled={isAuthenticating || !configStatus?.isConfigured}
                className="w-full"
              >
                <Shield className="h-4 w-4 mr-2" />
                {isAuthenticating ? 'Ansluter...' : 'Anslut till Zettle OAuth'}
              </Button>
            )}
          </div>

          {/* Configuration Status */}
          {configStatus && (
            <div className={`mt-6 p-4 border rounded-lg ${
              configStatus.error 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-3">
                {configStatus.error ? (
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-semibold mb-1 ${
                    configStatus.error ? 'text-red-900' : 'text-green-900'
                  }`}>
                    {configStatus.error ? 'Konfigurationsproblem' : 'Zettle-konfiguration verifierad'}
                  </h3>
                  
                  {configStatus.error ? (
                    <div>
                      <p className="text-sm text-red-800 mb-2">{configStatus.error}</p>
                      {configStatus.details && (
                        <p className="text-sm text-red-700">{configStatus.details}</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-green-800 space-y-1">
                      <p>✅ Miljö: <strong>{configStatus.environment}</strong></p>
                      <p>✅ Valuta: <strong>{configStatus.currency}</strong></p>
                      <p>✅ Land: <strong>{configStatus.country}</strong></p>
                      <p>✅ API-nycklar: <strong>Konfigurerade</strong></p>
                      <p className="mt-2 text-green-700">
                        🎉 Redo att logga in med dina Zettle-uppgifter!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Fallback configuration info if status not loaded */}
          {!configStatus && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Kontrollerar konfiguration...</h3>
                  <p className="text-sm text-blue-800">
                    Verifierar dina Zettle API-inställningar från miljövariablerna.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-blue-600" />
            Zettle POS-hantering
          </h1>
          <p className="text-gray-600 mt-1">
            Hantera produkter, transaktioner och synkronisering med ditt POS-system
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={loadProducts} 
            disabled={isLoadingProducts}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingProducts ? 'animate-spin' : ''}`} />
            Uppdatera
          </Button>
          <Link href="/admin/pos/sync">
            <Button variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
              <RotateCcw className="h-4 w-4 mr-2" />
              Fullständig synk
            </Button>
          </Link>
          <Button 
            onClick={handleSyncProducts} 
            disabled={isSyncing}
          >
            <RotateCcw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Snabbsynk' : 'Snabbsynk'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Produkter</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Transaktioner (30d)</p>
              <p className="text-2xl font-bold">{stats.recentTransactions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Omsättning (30d)</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue * 100)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Senaste sync</p>
              <p className="text-sm font-medium">
                {stats.lastSync ? formatDate(stats.lastSync) : 'Aldrig'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Produkter i Zettle
        </h2>
        
        {isLoadingProducts ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Laddar produkter...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Namn</th>
                  <th className="text-left py-2">Beskrivning</th>
                  <th className="text-right py-2">Pris</th>
                  <th className="text-left py-2">Referens</th>
                  <th className="text-left py-2">Uppdaterad</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((product) => (
                  <tr key={product.uuid} className="border-b">
                    <td className="py-2 font-medium">{product.name}</td>
                    <td className="py-2 text-gray-600">{product.description || '-'}</td>
                    <td className="py-2 text-right">{formatCurrency(product.price.amount, product.price.currencyId)}</td>
                    <td className="py-2 text-gray-600">{product.externalReference || '-'}</td>
                    <td className="py-2 text-gray-600">
                      {product.updatedAt ? formatDate(product.updatedAt) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length > 10 && (
              <p className="text-center text-gray-600 mt-4">
                Visar 10 av {products.length} produkter
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Inga produkter hittades</p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Senaste transaktioner
        </h2>
        
        {isLoadingTransactions ? (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Laddar transaktioner...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Datum</th>
                  <th className="text-right py-2">Belopp</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Betalmetod</th>
                  <th className="text-left py-2">Referens</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction) => (
                  <tr key={transaction.uuid} className="border-b">
                    <td className="py-2">{formatDate(transaction.timestamp)}</td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(transaction.amount, transaction.currencyId)}
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-2 text-gray-600">{transaction.paymentMethod}</td>
                    <td className="py-2 text-gray-600">{transaction.reference || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length > 10 && (
              <p className="text-center text-gray-600 mt-4">
                Visar 10 av {transactions.length} transaktioner
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Inga transaktioner hittades</p>
          </div>
        )}
      </div>
    </div>
  );
}
