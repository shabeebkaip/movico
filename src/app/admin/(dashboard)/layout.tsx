import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminToken } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token || !verifyAdminToken(token)) {
    redirect('/admin/login');
  }

  return <AdminShell>{children}</AdminShell>;
}
