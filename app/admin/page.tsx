import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  // Omdirigera adminroot till Tjänster
  redirect('/admin/services');
}
