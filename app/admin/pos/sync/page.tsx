'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeftRight, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  ShoppingCart,
  Wrench,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface SyncResult {
  fetched: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

interface SyncResponse {
  fromZettle?: SyncResult;
  toZettle?: SyncResult;
  message: string;
}

export default function POSSyncPage() {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResponse | null>(null);
  const [syncDirection, setSyncDirection] = useState<'from_zettle' | 'to_zettle' | 'bidirectional'>('from_zettle');

  const handleSync = async () => {
    if (!credentials.username || !credentials.password) {
      toast({
        title: 'Fel',
        description: 'Ange dina Zettle-inloggningsuppgifter',
        variant: 'destructive',
      });
      return;
    }

    setIsSyncing(true);
    setSyncResults(null);

    try {
      const response = await fetch('/api/zettle/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direction: syncDirection,
          username: credentials.username,
          password: credentials.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSyncResults(result.result);
        toast({
          title: 'Synkronisering slutförd!',
          description: result.message,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: 'Synkroniseringsfel',
        description: error.message || 'Ett fel uppstod vid synkronisering',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getSyncDirectionInfo = () => {
    switch (syncDirection) {
      case 'from_zettle':
        return {
          title: 'Hämta från Zettle POS',
          description: 'Importera alla produkter från ditt Zettle POS-system som tjänster i webappen',
          icon: <Download className="h-5 w-5" />,
          color: 'bg-blue-50 border-blue-200 text-blue-700'
        };
      case 'to_zettle':
        return {
          title: 'Skicka till Zettle POS',
          description: 'Exportera alla aktiva tjänster från webappen som produkter i Zettle',
          icon: <Upload className="h-5 w-5" />,
          color: 'bg-green-50 border-green-200 text-green-700'
        };
      case 'bidirectional':
        return {
          title: 'Tvåvägssynkronisering',
          description: 'Synkronisera data åt båda hållen mellan Zettle och webappen',
          icon: <ArrowLeftRight className="h-5 w-5" />,
          color: 'bg-purple-50 border-purple-200 text-purple-700'
        };
    }
  };

  const directionInfo = getSyncDirectionInfo();

  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pos">
          <Button variant="outline" className="px-3 py-1 text-sm">
            ← Tillbaka till POS
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <RefreshCw className="h-8 w-8 text-blue-600" />
            POS Datasynkronisering
          </h1>
          <p className="text-gray-600 mt-1">
            Synkronisera data mellan ditt Zettle POS-system och webappens tjänster
          </p>
        </div>
      </div>

      {/* Sync Direction Selection */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Välj synkroniseringsriktning</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setSyncDirection('from_zettle')}
            className={`p-4 border rounded-lg text-left transition-all ${
              syncDirection === 'from_zettle' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Download className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Från Zettle</span>
            </div>
            <p className="text-sm text-gray-600">
              Hämta POS-produkter → Webapp-tjänster
            </p>
          </button>

          <button
            onClick={() => setSyncDirection('to_zettle')}
            className={`p-4 border rounded-lg text-left transition-all ${
              syncDirection === 'to_zettle' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Upload className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Till Zettle</span>
            </div>
            <p className="text-sm text-gray-600">
              Webapp-tjänster → POS-produkter
            </p>
          </button>

          <button
            onClick={() => setSyncDirection('bidirectional')}
            className={`p-4 border rounded-lg text-left transition-all ${
              syncDirection === 'bidirectional' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <ArrowLeftRight className="h-5 w-5 text-purple-600" />
              <span className="font-semibold">Tvåvägs</span>
            </div>
            <p className="text-sm text-gray-600">
              Synkronisera åt båda hållen
            </p>
          </button>
        </div>

        {/* Selected Direction Info */}
        <div className={`p-4 border rounded-lg ${directionInfo.color}`}>
          <div className="flex items-start gap-3">
            {directionInfo.icon}
            <div>
              <h3 className="font-semibold mb-1">{directionInfo.title}</h3>
              <p className="text-sm">{directionInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Zettle-inloggning</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Användarnamn/E-post</Label>
            <Input
              id="username"
              type="email"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              placeholder="din@email.com"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Lösenord</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Ditt Zettle-lösenord"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSync} 
          disabled={isSyncing || !credentials.username || !credentials.password}
          className="mt-4 w-full"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Synkroniserar...
            </>
          ) : (
            <>
              {directionInfo.icon}
              <span className="ml-2">Starta synkronisering</span>
            </>
          )}
        </Button>
      </div>

      {/* Sync Results */}
      {syncResults && (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Synkroniseringsresultat
          </h2>

          {/* From Zettle Results */}
          {syncResults.fromZettle && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                Från Zettle POS → Webapp-tjänster
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{syncResults.fromZettle.fetched}</div>
                  <div className="text-sm text-blue-700">Hämtade</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{syncResults.fromZettle.created}</div>
                  <div className="text-sm text-green-700">Skapade</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{syncResults.fromZettle.updated}</div>
                  <div className="text-sm text-yellow-700">Uppdaterade</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600">{syncResults.fromZettle.skipped}</div>
                  <div className="text-sm text-gray-700">Hoppade över</div>
                </div>
              </div>

              {syncResults.fromZettle.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Fel ({syncResults.fromZettle.errors.length})
                  </h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {syncResults.fromZettle.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* To Zettle Results */}
          {syncResults.toZettle && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-green-600" />
                Webapp-tjänster → Zettle POS
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{syncResults.toZettle.fetched}</div>
                  <div className="text-sm text-blue-700">Hämtade</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{syncResults.toZettle.created}</div>
                  <div className="text-sm text-green-700">Skapade</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{syncResults.toZettle.updated}</div>
                  <div className="text-sm text-yellow-700">Uppdaterade</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600">{syncResults.toZettle.skipped}</div>
                  <div className="text-sm text-gray-700">Hoppade över</div>
                </div>
              </div>

              {syncResults.toZettle.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Fel ({syncResults.toZettle.errors.length})
                  </h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {syncResults.toZettle.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-900">Synkronisering slutförd!</span>
            </div>
            <p className="text-sm text-green-800 mt-1">{syncResults.message}</p>
          </div>

          {/* Next Steps */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Nästa steg:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Kontrollera dina tjänster i <Link href="/admin/services" className="underline">Tjänstehantering</Link></li>
              <li>• Verifiera produkter i <Link href="/admin/pos" className="underline">POS-systemet</Link></li>
              <li>• Testa betalningar och transaktioner</li>
            </ul>
          </div>
        </div>
      )}

      {/* Information Panel */}
      {!syncResults && (
        <div className="bg-gray-50 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            Synkroniseringsinformation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Vad synkroniseras?</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Produktnamn och beskrivningar</li>
                <li>• Priser (automatisk SEK/öre-konvertering)</li>
                <li>• Kategorier och klassificeringar</li>
                <li>• Aktiv/inaktiv status</li>
                <li>• Senaste uppdateringstid</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Säkerhetsåtgärder</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Säker OAuth 2.0-autentisering</li>
                <li>• Optimistisk låsning (etag)</li>
                <li>• Felhantering och återställning</li>
                <li>• Detaljerad loggning</li>
                <li>• Backup av befintlig data</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
