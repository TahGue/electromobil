'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ClockIcon, PercentIcon, TagIcon } from 'lucide-react';

interface PromoCountdown {
  id: string;
  isActive: boolean;
  title: string;
  description: string;
  percentage: number;
  couponCode: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
}

export default function PromoCountdownAdminPage() {
  const [promoConfig, setPromoConfig] = useState<PromoCountdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    isActive: true,
    title: 'Tidsbegränsat erbjudande',
    description: 'rabatt på skärmbyten',
    percentage: 15,
    couponCode: 'SAVE15',
    endDateTime: ''
  });

  useEffect(() => {
    fetchPromoConfig();
  }, []);

  const fetchPromoConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/promo-countdown');
      
      if (!response.ok) {
        throw new Error('Kunde inte hämta kampanjinformation');
      }
      
      const data = await response.json();
      setPromoConfig(data);
      
      // Update form data with fetched data
      setFormData({
        isActive: data.isActive,
        title: data.title,
        description: data.description,
        percentage: data.percentage,
        couponCode: data.couponCode,
        endDateTime: new Date(data.endDateTime).toISOString().slice(0, 16) // Format for datetime-local input
      });
    } catch (err) {
      setError('Kunde inte ladda kampanjinformation');
      console.error('Error fetching promo config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/promo-countdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunde inte spara kampanjinformation');
      }

      const updatedData = await response.json();
      setPromoConfig(updatedData);
      setSuccess('Kampanjinformation sparad!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Ett fel uppstod när kampanjinformationen skulle sparas');
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

  const getTimeRemaining = () => {
    if (!promoConfig) return null;
    
    const now = new Date().getTime();
    const end = new Date(promoConfig.endDateTime).getTime();
    const difference = end - now;
    
    if (difference <= 0) return { expired: true };
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, expired: false };
  };

  const timeRemaining = getTimeRemaining();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kampanjhantering</h1>
        <p className="text-gray-600 mt-2">
          Hantera tidsbegränsade erbjudanden och kampanjer på hemsidan
        </p>
      </div>

      {/* Current Status Card */}
      {promoConfig && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aktuell kampanj</CardTitle>
                <CardDescription>Status för den aktiva kampanjen</CardDescription>
              </div>
              <Badge variant={promoConfig.isActive ? 'default' : 'secondary'}>
                {promoConfig.isActive ? 'Aktiv' : 'Inaktiv'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{promoConfig.title}</h3>
                <p className="text-gray-600">{promoConfig.percentage}% {promoConfig.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Kupongkod: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{promoConfig.couponCode}</span>
                </p>
              </div>
              <div>
                {timeRemaining && !timeRemaining.expired ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tid kvar:</p>
                    <div className="flex space-x-2 text-sm">
                      <span className="bg-blue-100 px-2 py-1 rounded">{timeRemaining.days}d</span>
                      <span className="bg-blue-100 px-2 py-1 rounded">{timeRemaining.hours}h</span>
                      <span className="bg-blue-100 px-2 py-1 rounded">{timeRemaining.minutes}m</span>
                      <span className="bg-blue-100 px-2 py-1 rounded">{timeRemaining.seconds}s</span>
                    </div>
                  </div>
                ) : (
                  <Badge variant="destructive">Kampanjen har gått ut</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Redigera kampanj</CardTitle>
          <CardDescription>
            Uppdatera kampanjtext, rabatt och slutdatum
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Kampanj aktiv</Label>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Tidsbegränsat erbjudande"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Beskrivning</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="rabatt på skärmbyten"
            />
          </div>

          {/* Percentage */}
          <div className="space-y-2">
            <Label htmlFor="percentage">Rabatt (%)</Label>
            <div className="relative">
              <PercentIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <Input
                id="percentage"
                type="number"
                min="1"
                max="100"
                value={formData.percentage}
                onChange={(e) => handleInputChange('percentage', parseInt(e.target.value) || 0)}
                className="pl-10"
                placeholder="15"
              />
            </div>
          </div>

          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="couponCode">Kupongkod</Label>
            <div className="relative">
              <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <Input
                id="couponCode"
                value={formData.couponCode}
                onChange={(e) => handleInputChange('couponCode', e.target.value.toUpperCase())}
                className="pl-10 font-mono"
                placeholder="SAVE15"
              />
            </div>
          </div>

          {/* End Date Time */}
          <div className="space-y-2">
            <Label htmlFor="endDateTime">Slutdatum och tid</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <Input
                id="endDateTime"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => handleInputChange('endDateTime', e.target.value)}
                className="pl-10"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
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
            {saving ? 'Sparar...' : 'Spara kampanj'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
