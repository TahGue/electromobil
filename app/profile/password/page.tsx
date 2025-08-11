'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Key, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface PasswordChangeFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<PasswordChangeFormValues>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: PasswordChangeFormValues) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to change password');
      }

      toast({
        title: 'Framgång!',
        description: 'Ditt lösenord har ändrats framgångsrikt',
      });

      // Reset form
      const form = document.getElementById('password-form') as HTMLFormElement;
      form?.reset();

    } catch (err: any) {
      toast({
        title: 'Fel',
        description: err.message || 'Ett fel uppstod vid ändring av lösenordet',
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

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Åtkomst nekad</h2>
          <p className="text-gray-600 mb-4">Du måste vara inloggad för att ändra ditt lösenord</p>
          <Link href="/auth/signin">
            <Button>Logga in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Key className="h-8 w-8" />
          Ändra lösenord
        </h1>
        <p className="text-gray-600 mt-1">
          Uppdatera ditt lösenord för <strong>{session.user?.email}</strong>
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Säkerhetstips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Använd ett unikt lösenord som du inte använder på andra webbplatser</li>
              <li>• Inkludera stora och små bokstäver, siffror och specialtecken</li>
              <li>• Undvik personlig information som namn eller födelsedatum</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Password Form */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <form id="password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div>
            <Label htmlFor="currentPassword">Nuvarande lösenord</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                {...register('currentPassword', {
                  required: 'Nuvarande lösenord krävs'
                })}
                placeholder="Ange ditt nuvarande lösenord"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword">Nytt lösenord</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                {...register('newPassword', {
                  required: 'Nytt lösenord krävs',
                  minLength: {
                    value: 8,
                    message: 'Lösenordet måste vara minst 8 tecken långt'
                  }
                })}
                placeholder="Ange nytt lösenord"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
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

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Bekräftelse av lösenord krävs',
                  validate: (value) =>
                    value === newPassword || 'Lösenorden matchar inte'
                })}
                placeholder="Bekräfta nytt lösenord"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Lösenordskrav:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${newPassword?.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={newPassword?.length >= 8 ? 'text-green-600' : 'text-gray-800'}>
                  Minst 8 tecken
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${/[a-z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={/[a-z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-600'}>
                  Små bokstäver
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${/[A-Z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={/[A-Z]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-600'}>
                  Stora bokstäver
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${/\d/.test(newPassword || '') ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={/\d/.test(newPassword || '') ? 'text-green-600' : 'text-gray-600'}>
                  Siffror
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${/[!@#$%^&*(),.?":{}|<>]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword || '') ? 'text-green-600' : 'text-gray-600'}>
                  Specialtecken
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Ändrar lösenord...' : 'Ändra lösenord'}
          </Button>
        </form>
      </div>
    </div>
  );
}
