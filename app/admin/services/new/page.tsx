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
        throw new Error(errorData.message || 'Misslyckades med att skapa tjänst');
      }
      router.push('/admin/services');
      router.refresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  return (
    <div className="container py-8 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Lägg till ny tjänst</h1>
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">Namn</Label>
          <Input id="name" className="bg-white text-gray-900 placeholder:text-gray-500" {...register('name', { required: 'Namn är obligatoriskt' })} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Beskrivning</Label>
          <Textarea id="description" className="bg-white text-gray-900 placeholder:text-gray-500" {...register('description', { required: 'Beskrivning är obligatorisk' })} />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <Label htmlFor="price">Pris (SEK)</Label>
          <Input id="price" type="number" step="0.01" className="bg-white text-gray-900 placeholder:text-gray-500" {...register('price', { required: 'Pris är obligatoriskt', valueAsNumber: true })} />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="duration">Varaktighet (i minuter)</Label>
          <Input id="duration" type="number" className="bg-white text-gray-900 placeholder:text-gray-500" {...register('duration', { required: 'Varaktighet är obligatoriskt', valueAsNumber: true })} />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Input id="category" className="bg-white text-gray-900 placeholder:text-gray-500" {...register('category', { required: 'Kategori är obligatoriskt' })} />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isActive" {...register('isActive')} />
          <Label htmlFor="isActive">Aktiv</Label>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Lägger till...' : 'Lägg till tjänst'}
        </Button>
      </form>
    </div>
  );
}


