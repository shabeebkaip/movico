import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminToken } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;

  if (!token || !verifyAdminToken(token)) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 min-h-screen bg-slate-50 overflow-x-hidden">{children}</main>
    </div>
  );
}
