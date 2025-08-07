'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BusinessInfoFormValues {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  socialLinks: string;
}

export default function AdminBusinessInfoPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BusinessInfoFormValues>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const res = await fetch('/api/business-info', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch business info');
        const data = await res.json();
        // Stringify JSON fields for textarea display
        const formData = {
          ...data,
          hours: data.hours ? JSON.stringify(data.hours, null, 2) : '{}',
          socialLinks: data.socialLinks ? JSON.stringify(data.socialLinks, null, 2) : '{}',
        };
        reset(formData);
      } catch (err: any) {
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinessInfo();
  }, [reset]);

  const onSubmit = async (data: BusinessInfoFormValues) => {
    setApiError(null);
    try {
      const res = await fetch('/api/business-info', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update business info');
      }

      const updatedData = await res.json();
      // Re-stringify for display
      const formData = {
        ...updatedData,
        hours: updatedData.hours ? JSON.stringify(updatedData.hours, null, 2) : '{}',
        socialLinks: updatedData.socialLinks ? JSON.stringify(updatedData.socialLinks, null, 2) : '{}',
      };
      reset(formData);

      alert('Business information updated successfully!');
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  if (isLoading) return <p>Loading business info...</p>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Business Information</h1>
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <Input type="hidden" {...register('id')} />
        <div>
          <Label htmlFor="name">Company Name</Label>
          <Input id="name" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register('address', { required: 'Address is required' })} />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('phone', { required: 'Phone is required' })} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="hours">Hours (JSON)</Label>
          <textarea id="hours" {...register('hours')} rows={2} />
          {errors.hours && <p className="text-red-500 text-sm mt-1">{errors.hours.message}</p>}
        </div>
        <div>
          <Label htmlFor="socialLinks">Social Links (JSON)</Label>
          <textarea id="socialLinks" {...register('socialLinks')} rows={2} />
          {errors.socialLinks && <p className="text-red-500 text-sm mt-1">{errors.socialLinks.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
