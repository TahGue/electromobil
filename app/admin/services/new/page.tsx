'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ServiceFormValues {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

export default function NewServicePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>({
    defaultValues: {
      isActive: true,
    }
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: ServiceFormValues) => {
    setApiError(null);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create service');
      }
      router.push('/admin/services');
      router.refresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Add New Service</h1>
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description', { required: 'Description is required' })} />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" {...register('price', { required: 'Price is required', valueAsNumber: true })} />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="duration">Duration (in minutes)</Label>
          <Input id="duration" type="number" {...register('duration', { required: 'Duration is required', valueAsNumber: true })} />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register('category', { required: 'Category is required' })} />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isActive" {...register('isActive')} />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Service'}
        </Button>
      </form>
    </div>
  );
}
