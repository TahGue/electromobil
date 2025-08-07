'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          const res = await fetch(`/api/services/${id}`);
          if (!res.ok) throw new Error('Failed to fetch service data');
          const data = await res.json();
          reset(data); // Populate form with fetched data
        } catch (err: any) {
          setApiError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchService();
    }
  }, [id, reset]);

  const onSubmit = async (data: ServiceFormValues) => {
    setApiError(null);
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update service');
      }
      router.push('/admin/services');
      router.refresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  if (isLoading) return <p>Loading service...</p>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
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
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
