'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

interface UserFormValues {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<UserFormValues>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`/api/users/${id}`);
          if (!res.ok) throw new Error('Failed to fetch user data');
          const data = await res.json();
          reset(data); // Populate form with fetched data
        } catch (err: any) {
          setApiError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, reset]);

  const onSubmit = async (data: UserFormValues) => {
    setApiError(null);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
      router.push('/admin/users');
      router.refresh();
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  if (isLoading) return <p>Loading user...</p>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name', { required: 'Name is required' })} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('phone')} />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={(value) => reset({ ...control._formValues, role: value as UserRole })} defaultValue={control._formValues.role}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}


