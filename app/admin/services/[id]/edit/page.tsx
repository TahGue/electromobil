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
          if (!res.ok) throw new Error('Misslyckades med att hämta tjänstdata');
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
        throw new Error(errorData.message || 'Misslyckades med att uppdatera tjänsten');
      }
      router.push('/admin/services');
      router.refresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  if (isLoading) return <p>Laddar tjänst...</p>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Redigera Tjänst</h1>
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">Namn</Label>
          <Input id="name" {...register('name', { required: 'Namn är obligatoriskt' })} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Beskrivning</Label>
          <Textarea id="description" {...register('description', { required: 'Beskrivning är obligatorisk' })} />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <Label htmlFor="price">Pris (SEK)</Label>
          <Input id="price" type="number" step="0.01" {...register('price', { required: 'Pris är obligatoriskt', valueAsNumber: true })} />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="duration">Varaktighet (i minuter)</Label>
          <Input id="duration" type="number" {...register('duration', { required: 'Varaktighet är obligatoriskt', valueAsNumber: true })} />
          {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Input id="category" {...register('category', { required: 'Kategori är obligatoriskt' })} />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="isActive" {...register('isActive')} />
          <Label htmlFor="isActive">Aktiv</Label>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sparar...' : 'Spara ändringar'}
        </Button>
      </form>
    </div>
  );
}


