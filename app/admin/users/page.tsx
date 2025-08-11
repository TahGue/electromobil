'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Copy, RefreshCw } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Är du säker på att du vill radera denna användare?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers((prev) => prev.filter(u => u.id !== id));
      toast({
        title: 'Framgång',
        description: 'Användaren har raderats',
      });
    } catch (err: any) {
      toast({
        title: 'Fel',
        description: err.message || 'Kunde inte radera användaren',
        variant: 'destructive',
      });
    }
  };

  const handlePasswordReset = async (user: User) => {
    if (!window.confirm(`Är du säker på att du vill återställa lösenordet för ${user.name}?`)) return;
    
    try {
      const res = await fetch(`/api/users/${user.id}/reset-password`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to reset password');
      
      const data = await res.json();
      
      // Copy temporary password to clipboard
      await navigator.clipboard.writeText(data.temporaryPassword);
      
      toast({
        title: 'Lösenord återställt',
        description: `Tillfälligt lösenord för ${user.name} har kopierats till urklipp: ${data.temporaryPassword}`,
        duration: 10000,
      });
    } catch (err: any) {
      toast({
        title: 'Fel',
        description: err.message || 'Kunde inte återställa lösenordet',
        variant: 'destructive',
      });
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 border">{u.name}</td>
                <td className="px-4 py-2 border">{u.email}</td>
                <td className="px-4 py-2 border">{u.role}</td>
                <td className="px-4 py-2 border space-x-2">
                  <Link href={`/admin/users/${u.id}/edit`}>
                    <Button variant="outline" className="px-3 py-1 text-sm">Redigera</Button>
                  </Link>
                  <Link href={`/admin/users/${u.id}/password`}>
                    <Button variant="outline" className="px-3 py-1 text-sm bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                      Ändra
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => handlePasswordReset(u)}
                    className="px-3 py-1 text-sm bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Återställ
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDelete(u.id)} 
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                  >
                    Radera
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
