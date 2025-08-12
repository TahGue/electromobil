'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceModel?: string;
  deviceIssue?: string;
  preferredDate: string;
  status: string;
  estimatedPrice?: number;
  finalPrice?: number;
  notes?: string;
  service: {
    name: string;
    description: string;
    price: number;
  };
  createdAt: string;
}

interface UserProfile {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  image?: string;
  provider?: string;
  firstName?: string;
  lastName?: string;
  bookings: Booking[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchProfile();
    }
  }, [status, session]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte hämta profil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Framgång',
          description: 'Profil uppdaterad',
        });
        fetchProfile();
      } else {
        toast({
          title: 'Fel',
          description: 'Kunde inte uppdatera profil',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Fel',
        description: 'Ett fel uppstod',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Väntar';
      case 'confirmed':
        return 'Bekräftad';
      case 'in_progress':
        return 'Pågår';
      case 'completed':
        return 'Klar';
      case 'cancelled':
        return 'Avbruten';
      default:
        return status;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Du måste logga in</h1>
        <p className="mb-4">För att se din profil och bokningar måste du logga in.</p>
        <Link href="/auth/signin">
          <Button>Logga in</Button>
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profil inte hittad</h1>
        <p>Kunde inte hämta din profil.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Min Profil</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profilinformation</CardTitle>
            <CardDescription>
              Hantera din personliga information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profilbild"
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">
                    {profile.name?.charAt(0) || profile.email.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{profile.name || 'Inget namn'}</h3>
                <p className="text-gray-600">{profile.email}</p>
                {profile.provider && (
                  <Badge variant="outline" className="mt-1">
                    Inloggad via {profile.provider}
                  </Badge>
                )}
              </div>
            </div>

            <form onSubmit={updateProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Förnamn</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Ditt förnamn"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Efternamn</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Ditt efternamn"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="name">Fullständigt namn</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ditt fullständiga namn"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ditt telefonnummer"
                />
              </div>

              <Button type="submit" disabled={updating}>
                {updating ? 'Uppdaterar...' : 'Uppdatera profil'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Kontoinställningar</CardTitle>
            <CardDescription>
              Hantera ditt konto och säkerhet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>E-postadress</Label>
              <Input value={profile.email} disabled />
              <p className="text-sm text-gray-600 mt-1">
                E-postadressen kan inte ändras
              </p>
            </div>

            {!profile.provider && (
              <div>
                <Link href="/profile/password">
                  <Button variant="outline" className="w-full">
                    Ändra lösenord
                  </Button>
                </Link>
              </div>
            )}

            <div className="border-t border-border my-4"></div>

            <div>
              <h4 className="font-semibold mb-2">Kontotyp</h4>
              <Badge variant={profile.provider ? 'default' : 'secondary'}>
                {profile.provider ? `Social login (${profile.provider})` : 'Lokalt konto'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Mina bokningar</CardTitle>
          <CardDescription>
            Översikt över dina reparationsbokningar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.bookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Du har inga bokningar än.</p>
              <Link href="/booking">
                <Button>Boka reparation</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">
                        Bokning #{booking.bookingNumber}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {booking.service.name}
                      </p>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Enhet:</strong> {booking.deviceModel || 'Ej specificerad'}</p>
                      <p><strong>Problem:</strong> {booking.deviceIssue || 'Ej specificerat'}</p>
                      <p><strong>Datum:</strong> {new Date(booking.preferredDate).toLocaleDateString('sv-SE')}</p>
                    </div>
                    <div>
                      <p><strong>Uppskattat pris:</strong> {booking.estimatedPrice ? `${booking.estimatedPrice} SEK` : 'Ej uppskattat'}</p>
                      {booking.finalPrice && (
                        <p><strong>Slutpris:</strong> {booking.finalPrice} SEK</p>
                      )}
                      <p><strong>Bokad:</strong> {new Date(booking.createdAt).toLocaleDateString('sv-SE')}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-sm"><strong>Anteckningar:</strong> {booking.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
