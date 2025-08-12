import { requireAdmin } from '@/lib/admin';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminPanel from '@/components/admin/AdminPanel';
import './admin.css';

export default async function AdminPage() {
  // Check if user is authenticated first
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/registration');
  }

  // This will redirect non-admin users to home
  const adminUser = await requireAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Panel
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {adminUser.firstName || adminUser.email}
          </p>
        </div>
        
        <AdminPanel />
      </div>
    </div>
  );
}
