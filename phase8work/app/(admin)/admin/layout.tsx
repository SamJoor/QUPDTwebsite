import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/admin-shell';
import { requireSession } from '@/lib/auth/session';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireSession('admin');
  if (!session) redirect('/admin/login');
  return <AdminShell session={session}>{children}</AdminShell>;
}
