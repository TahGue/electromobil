'use client';

import { Shield, Key, Users, RefreshCw, Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PasswordManagementDocPage() {
  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-blue-600" />
          Lösenordshantering
        </h1>
        <p className="text-gray-600 text-lg">
          Komplett guide för säker hantering av användarlösenord i admin-panelen
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/users">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors cursor-pointer">
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-blue-900">Hantera användare</h3>
            <p className="text-sm text-blue-700">Visa alla användare och hantera lösenord</p>
          </div>
        </Link>
        <Link href="/profile/password">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 hover:bg-green-100 transition-colors cursor-pointer">
            <Key className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-green-900">Ändra mitt lösenord</h3>
            <p className="text-sm text-green-700">Uppdatera ditt eget lösenord</p>
          </div>
        </Link>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <AlertTriangle className="h-6 w-6 text-orange-600 mb-2" />
          <h3 className="font-semibold text-orange-900">Säkerhetsriktlinjer</h3>
          <p className="text-sm text-orange-700">Viktiga säkerhetsprinciper att följa</p>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Info className="h-6 w-6 text-blue-600" />
          Funktioner
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-blue-900">För administratörer</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Ändra användarlösenord:</strong> Sätt nya lösenord för alla användare</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Återställ lösenord:</strong> Generera tillfälliga säkra lösenord</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Lösenordsstyrka:</strong> Realtidsvalidering och styrkeindikator</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Automatisk kopiering:</strong> Tillfälliga lösenord kopieras till urklipp</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-900">För användare</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Självbetjäning:</strong> Ändra ditt eget lösenord när som helst</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Säker validering:</strong> Bekräfta nuvarande lösenord innan ändring</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Visuell feedback:</strong> Se lösenordsstyrka i realtid</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Visa/dölj:</strong> Växla synlighet för lösenordsfält</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Så här använder du systemet</h2>
        
        <div className="space-y-6">
          {/* Admin Instructions */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-blue-900 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Som administratör
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">1. Ändra användarlösenord</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Gå till <strong>Användare</strong> i admin-menyn</li>
                <li>Klicka på <strong>"Ändra"</strong>-knappen för den användare du vill uppdatera</li>
                <li>Ange ett nytt säkert lösenord (minst 8 tecken)</li>
                <li>Bekräfta lösenordet och klicka <strong>"Uppdatera lösenord"</strong></li>
                <li>Informera användaren om det nya lösenordet säkert</li>
              </ol>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                2. Återställ lösenord (generera tillfälligt)
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800">
                <li>Gå till <strong>Användare</strong> i admin-menyn</li>
                <li>Klicka på <strong>"Återställ"</strong>-knappen för användaren</li>
                <li>Bekräfta åtgärden i dialogrutan</li>
                <li>Det tillfälliga lösenordet kopieras automatiskt till urklipp</li>
                <li>Dela det tillfälliga lösenordet med användaren säkert</li>
                <li>Instruera användaren att ändra lösenordet vid nästa inloggning</li>
              </ol>
            </div>
          </div>

          {/* User Instructions */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-green-900 flex items-center gap-2">
              <Key className="h-5 w-5" />
              Som användare
            </h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Ändra ditt lösenord</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-green-800">
                <li>Logga in på ditt konto</li>
                <li>Gå till <strong>Profil → Ändra lösenord</strong></li>
                <li>Ange ditt nuvarande lösenord</li>
                <li>Skriv in ditt nya lösenord (följ säkerhetskraven)</li>
                <li>Bekräfta det nya lösenordet</li>
                <li>Klicka <strong>"Ändra lösenord"</strong></li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Security Guidelines */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-600" />
          Säkerhetsriktlinjer
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-900">Lösenordskrav</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span><strong>Minst 8 tecken</strong> långt</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span><strong>Stora och små bokstäver</strong> (A-Z, a-z)</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span><strong>Siffror</strong> (0-9)</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span><strong>Specialtecken</strong> (!@#$%^&*)</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-900">Bästa praxis</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Använd <strong>unika lösenord</strong> för varje tjänst</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Undvik <strong>personlig information</strong> i lösenord</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ändra lösenord <strong>regelbundet</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Dela <strong>aldrig</strong> lösenord osäkert</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gray-50 border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Tekniska detaljer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Säkerhet</h3>
            <ul className="space-y-1">
              <li>• <strong>bcrypt-hashning</strong> med 12 salt rounds</li>
              <li>• <strong>NextAuth</strong> för sessionshantering</li>
              <li>• <strong>Rollbaserad</strong> åtkomstkontroll</li>
              <li>• <strong>HTTPS</strong> för all kommunikation</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">API-endpoints</h3>
            <ul className="space-y-1 font-mono text-xs">
              <li>• <code>POST /api/auth/change-password</code></li>
              <li>• <code>PUT /api/users/[id]/password</code></li>
              <li>• <code>POST /api/users/[id]/reset-password</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
