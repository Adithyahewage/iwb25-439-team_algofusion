'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { User } from '@/lib/types/courier';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow the login page to render without auth guard
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (authApi.isAuthenticated()) {
          const authData = authApi.getAuthData();
          if (authData) {
            setUser(authData.user);
          } else {
            // Try to get profile
            const profile = await authApi.getProfile();
            setUser(profile);
          }
        } else {
          // Redirect to login if not authenticated
          router.push('/admin/login');
          return;
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/admin/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      authApi.clearAuthData();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      authApi.clearAuthData();
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // On login page, render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} onLogout={handleLogout} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
