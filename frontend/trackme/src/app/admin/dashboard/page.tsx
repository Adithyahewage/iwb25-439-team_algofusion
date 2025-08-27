'use client';

import { useEffect, useState } from 'react';
import { Parcel } from '@/lib/types/parcel';
import { parcelApi } from '@/lib/api/parcels';
import { authApi } from '@/lib/api/auth';
import DashboardStats from '@/components/admin/DashboardStats';
import StatusOverview from '@/components/admin/StatusOverview';
import RecentParcels from '@/components/admin/RecentParcels';

export default function AdminDashboardPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use a mock courier service ID for demo
        const courierServiceId = 'demo-courier-service-id';
        const parcelsData = await parcelApi.getAll(courierServiceId);
        setParcels(parcelsData);
      } catch (error) {
        console.error('Failed to fetch parcels:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const courierServiceId = 'demo-courier-service-id';
      const parcelsData = await parcelApi.getAll(courierServiceId);
      setParcels(parcelsData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalParcels = parcels.length;
  const deliveredParcels = parcels.filter(p => p.status === 'Delivered').length;
  const inTransitParcels = parcels.filter(p => p.status === 'In Transit').length;
  const pendingParcels = parcels.filter(p => p.status === 'Created').length;
  const failedParcels = parcels.filter(p => ['Failed Delivery', 'Returned'].includes(p.status)).length;

  // Get recent parcels (last 5)
  const recentParcels = parcels
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <DashboardStats
        totalParcels={totalParcels}
        deliveredParcels={deliveredParcels}
        inTransitParcels={inTransitParcels}
        pendingParcels={pendingParcels}
        failedParcels={failedParcels}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusOverview parcels={parcels} />
        <RecentParcels parcels={recentParcels} />
      </div>
    </div>
  );
}
