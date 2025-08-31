'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { 
  LayoutDashboard, 
  Package, 
  Plus, 
  Users, 
  BarChart3, 
  Settings,
  Truck,
  FileText
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and analytics'
  },
  {
    name: 'Parcels',
    href: '/admin/parcels',
    icon: Package,
    description: 'Manage all parcels'
  },
  {
    name: 'Create Parcel',
    href: '/admin/parcels/new',
    icon: Plus,
    description: 'Add new parcel'
  },
  {
    name: 'Status Updates',
    href: '/admin/status-updates',
    icon: Truck,
    description: 'Update delivery status'
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Customer management'
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
    description: 'Analytics and reports'
  },
  {
    name: 'Documents',
    href: '/admin/documents',
    icon: FileText,
    description: 'Manage documents'
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    description: 'System configuration'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="mt-8 px-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Link
            href="/admin/parcels/new"
            className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Parcel
          </Link>
          <Link
            href="/admin/status-updates"
            className="flex items-center px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
          >
            <Truck className="mr-2 h-4 w-4" />
            Update Status
          </Link>
        </div>
      </div>
    </div>
  );
}
