'use client';

import { useEffect, useState } from 'react';
import { Parcel, ParcelStatus } from '@/lib/types/parcel';
import { parcelApi } from '@/lib/api/parcels';
import ParcelList from '@/components/admin/ParcelList';
import ParcelFilters from '@/components/admin/ParcelFilters';

export default function ParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ParcelStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'status' | 'trackingNumber'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        setLoading(true);
        const courierServiceId = 'demo-courier-service-id';
        const parcelsData = await parcelApi.getAll(courierServiceId);
        setParcels(parcelsData);
        setFilteredParcels(parcelsData);
      } catch (error) {
        console.error('Failed to fetch parcels:', error);
        setError('Failed to load parcels');
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...parcels];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(parcel =>
        parcel.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parcel.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parcel.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(parcel => parcel.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'trackingNumber':
          aValue = a.trackingNumber;
          bValue = b.trackingNumber;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredParcels(filtered);
  }, [parcels, searchQuery, statusFilter, sortBy, sortOrder]);

  const handleDelete = async (id: string) => {
    try {
      await parcelApi.delete(id);
      setParcels(parcels.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete parcel:', error);
      setError('Failed to delete parcel');
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError('');
      const courierServiceId = 'demo-courier-service-id';
      const parcelsData = await parcelApi.getAll(courierServiceId);
      setParcels(parcelsData);
    } catch (error) {
      console.error('Failed to refresh parcels:', error);
      setError('Failed to refresh parcels');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Parcels</h1>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Parcels</h1>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <ParcelFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        totalParcels={parcels.length}
        filteredParcels={filteredParcels.length}
      />

      <ParcelList
        parcels={filteredParcels}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
