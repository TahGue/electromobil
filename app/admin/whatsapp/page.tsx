'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Phone, Settings, ExternalLink } from 'lucide-react';

interface WhatsAppConfig {
  id: string;
  isEnabled: boolean;
  phoneNumber: string;
  businessName: string;
  welcomeMessage: string;
  position: 'bottom-right' | 'bottom-left';
  createdAt: string;
  updatedAt: string;
}

export default function WhatsAppAdminPage() {
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    isEnabled: true,
    phoneNumber: '0701234567',
    businessName: 'Electromobil',
    welcomeMessage: 'Hej! 👋 Hur kan vi hjälpa dig idag?',
    position: 'bottom-right' as 'bottom-right' | 'bottom-left'
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/whatsapp-config');
      
      if (!response.ok) {
        throw new Error('Kunde inte hämta WhatsApp-konfiguration');
      }
      
      const data = await response.json();
      setConfig(data);
      
      // Update form data with fetched data
      setFormData({
        isEnabled: data.isEnabled,
        phoneNumber: data.phoneNumber,
        businessName: data.businessName,
        welcomeMessage: data.welcomeMessage,
        position: data.position
      });
    } catch (err) {
      setError('Kunde inte ladda WhatsApp-konfiguration');
      console.error('Error fetching WhatsApp config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/whatsapp-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte spara WhatsApp-konfiguration');
      }

      const updatedData = await response.json();
      setConfig(updatedData);
      setSuccess('WhatsApp-konfiguration sparad!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Ett fel uppstod när WhatsApp-konfigurationen skulle sparas');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testWhatsApp = () => {
    const formattedNumber = formData.phoneNumber.replace(/\D/g, '');
    const testMessage = encodeURIComponent('Test från admin-panelen');
    const url = `https://wa.me/46${formattedNumber.startsWith('0') ? formattedNumber.substring(1) : formattedNumber}?text=${testMessage}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">WhatsApp Chat</h1>
        <p className="text-gray-600 mt-2">
          Hantera WhatsApp-chattfunktionen på hemsidan
        </p>
      </div>

      {/* Current Status Card */}
      {config && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span>WhatsApp Status</span>
                </CardTitle>
                <CardDescription>Aktuell status för WhatsApp-chatten</CardDescription>
              </div>
              <Badge variant={config.isEnabled ? 'default' : 'secondary'}>
                {config.isEnabled ? 'Aktiv' : 'Inaktiv'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{config.businessName}</span>
                </h3>
                <p className="text-gray-600">Telefon: {config.phoneNumber}</p>
                <p className="text-sm text-gray-500 mt-2">Position: {config.position === 'bottom-right' ? 'Höger nederkant' : 'Vänster nederkant'}</p>
              </div>
              <div>
                <Button
                  onClick={testWhatsApp}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Testa WhatsApp</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>WhatsApp-inställningar</span>
          </CardTitle>
          <CardDescription>
            Konfigurera WhatsApp-chattfunktionen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isEnabled"
              checked={formData.isEnabled}
              onCheckedChange={(checked) => handleInputChange('isEnabled', checked)}
            />
            <Label htmlFor="isEnabled">Aktivera WhatsApp-chat</Label>
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Företagsnamn</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Electromobil"
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Telefonnummer</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="pl-10"
                placeholder="0701234567"
              />
            </div>
            <p className="text-xs text-gray-500">
              Använd svenskt format (07xxxxxxxx). Landskod (+46) läggs till automatiskt.
            </p>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Välkomstmeddelande</Label>
            <Textarea
              id="welcomeMessage"
              value={formData.welcomeMessage}
              onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
              placeholder="Hej! 👋 Hur kan vi hjälpa dig idag?"
              rows={3}
            />
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Position på sidan</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => handleInputChange('position', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Höger nederkant</SelectItem>
                <SelectItem value="bottom-left">Vänster nederkant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Sparar...' : 'Spara inställningar'}
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Så här fungerar det</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Fördelar</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Direkt kontakt med kunder</li>
                <li>• Fungerar på alla enheter</li>
                <li>• Ingen installation krävs</li>
                <li>• Gratis att använda</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">ℹ️ Information</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Kunder använder sin egen WhatsApp</li>
                <li>• Meddelanden kommer till ditt telefonnummer</li>
                <li>• Automatiska snabbsvar tillgängliga</li>
                <li>• Öppettider visas automatiskt</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
