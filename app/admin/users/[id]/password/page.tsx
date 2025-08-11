'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Key, Shield, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface PasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<PasswordFormValues>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const newPassword = watch('newPassword');

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) throw new Error('Failed to fetch user data');
          const userData = await res.json();
          setUser(userData);
        } catch (err: any) {
          toast({
            title: 'Fel',
            description: 'Kunde inte hämta användardata',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, toast]);

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const res = await fetch(`/api/users/${id}/password`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to update password');
      }

      toast({
        title: 'Framgång',
        description: 'Lösenordet har uppdaterats framgångsrikt',
      });

      router.push('/admin/users');
    } catch (err: any) {
      toast({
        title: 'Fel',
        description: err.message || 'Ett fel uppstod vid uppdatering av lösenordet',
        variant: 'destructive',
      });
    }
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    strength = Object.values(checks).filter(Boolean).length;

    if (strength < 2) return { strength, label: 'Mycket svagt', color: 'text-red-600' };
    if (strength < 3) return { strength, label: 'Svagt', color: 'text-orange-600' };
    if (strength < 4) return { strength, label: 'Medel', color: 'text-yellow-600' };
    if (strength < 5) return { strength, label: 'Starkt', color: 'text-blue-600' };
    return { strength, label: 'Mycket starkt', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(newPassword || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Laddar användardata...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Användaren hittades inte</h2>
          <Link href="/admin/users">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka till användare
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/users">
          <Button variant="outline" className="px-3 py-1 text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Key className="h-8 w-8" />
            Ändra lösenord
          </h1>
          <p className="text-gray-600 mt-1">
            Uppdatera lösenordet för <strong>{user.name}</strong> ({user.email})
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Säkerhetsmeddelande</h3>
            <p className="text-sm text-blue-800">
              Som administratör kan du ändra lösenord för alla användare. Det nya lösenordet kommer att hashas säkert och användaren kommer att behöva använda det nya lösenordet vid nästa inloggning.
            </p>
          </div>
        </div>
      </div>

      {/* Password Form */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="newPassword">Nytt lösenord</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword', {
                required: 'Nytt lösenord krävs',
                minLength: {
                  value: 8,
                  message: 'Lösenordet måste vara minst 8 tecken långt'
                }
              })}
              placeholder="Ange nytt lösenord"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
            )}
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600">Lösenordsstyrka:</span>
                  <span className={`text-sm font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength < 2 ? 'bg-red-500' :
                      passwordStrength.strength < 3 ? 'bg-orange-500' :
                      passwordStrength.strength < 4 ? 'bg-yellow-500' :
                      passwordStrength.strength < 5 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Bekräftelse av lösenord krävs',
                validate: (value) =>
                  value === newPassword || 'Lösenorden matchar inte'
              })}
              placeholder="Bekräfta nytt lösenord"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Lösenordskrav:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <span className={newPassword?.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                  {newPassword?.length >= 8 ? '✓' : '○'}
                </span>
                Minst 8 tecken långt
              </li>
              <li className="flex items-center gap-2">
                <span className={/[a-z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-400'}>
                  {/[a-z]/.test(newPassword || '') ? '✓' : '○'}
                </span>
                Innehåller små bokstäver
              </li>
              <li className="flex items-center gap-2">
                <span className={/[A-Z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-400'}>
                  {/[A-Z]/.test(newPassword || '') ? '✓' : '○'}
                </span>
                Innehåller stora bokstäver
              </li>
              <li className="flex items-center gap-2">
                <span className={/\d/.test(newPassword || '') ? 'text-green-600' : 'text-gray-400'}>
                  {/\d/.test(newPassword || '') ? '✓' : '○'}
                </span>
                Innehåller siffror
              </li>
              <li className="flex items-center gap-2">
                <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-400'}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword || '') ? '✓' : '○'}
                </span>
                Innehåller specialtecken
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Uppdaterar...' : 'Uppdatera lösenord'}
            </Button>
            <Link href="/admin/users">
              <Button type="button" variant="outline">
                Avbryt
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
