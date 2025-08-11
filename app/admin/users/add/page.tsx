'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, User, Mail, Shield, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface FormData {
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  password: string;
  confirmPassword: string;
  sendWelcomeEmail: boolean;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function AddUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'CUSTOMER',
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: false
  });

  // Password validation helpers
  const passwordRequirements = [
    { test: (pwd: string) => pwd.length >= 8, label: 'Minst 8 tecken' },
    { test: (pwd: string) => /[a-z]/.test(pwd), label: 'Liten bokstav (a-z)' },
    { test: (pwd: string) => /[A-Z]/.test(pwd), label: 'Stor bokstav (A-Z)' },
    { test: (pwd: string) => /\d/.test(pwd), label: 'Siffra (0-9)' },
    { test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), label: 'Specialtecken (!@#$...)' }
  ];

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Namn krävs';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-postadress krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ogiltig e-postadress';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Lösenord krävs';
    } else {
      const failedRequirements = passwordRequirements.filter(req => !req.test(formData.password));
      if (failedRequirements.length > 0) {
        newErrors.password = 'Lösenordet uppfyller inte alla krav';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Bekräfta lösenord krävs';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Lösenorden matchar inte';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          role: formData.role,
          password: formData.password,
          sendWelcomeEmail: formData.sendWelcomeEmail
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Handle validation errors from API
          const newErrors: ValidationErrors = {};
          data.details.forEach((detail: any) => {
            newErrors[detail.field as keyof ValidationErrors] = detail.message;
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: data.error || 'Ett fel uppstod' });
        }
        return;
      }

      toast({
        title: 'Framgång!',
        description: `Användare ${data.user.name} har skapats framgångsrikt`,
      });

      // Redirect back to users list
      router.push('/admin/users');

    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ general: 'Ett oväntat fel uppstod' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/users">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tillbaka
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Lägg till ny användare</h1>
          <p className="text-gray-600">Skapa ett nytt användarkonto</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-red-800">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Namn *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ange användarens fullständiga namn"
                className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">E-postadress *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="anvandare@example.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                disabled={loading}
              />
            </div>
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>

          {/* Role Field */}
          <div className="space-y-2">
            <Label htmlFor="role">Roll *</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as 'CUSTOMER' | 'ADMIN')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="CUSTOMER">Kund</option>
                <option value="ADMIN">Administratör</option>
              </select>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Lösenord *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Ange ett säkert lösenord"
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

            {/* Password Requirements */}
            {formData.password && (
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Lösenordskrav:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {passwordRequirements.map((req, index) => {
                    const isValid = req.test(formData.password);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        {isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={isValid ? 'text-green-600' : 'text-gray-800'}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Bekräfta lösenord *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Ange lösenordet igen"
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Welcome Email Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendWelcomeEmail"
              checked={formData.sendWelcomeEmail}
              onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={loading}
            />
            <Label htmlFor="sendWelcomeEmail" className="text-sm">
              Skicka välkomstmail till användaren
            </Label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Skapar användare...' : 'Skapa användare'}
            </Button>
            <Link href="/admin/users">
              <Button type="button" variant="outline" disabled={loading}>
                Avbryt
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
