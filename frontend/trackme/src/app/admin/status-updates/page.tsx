'use client';

import { useEffect, useState } from 'react';
import { Parcel, ParcelStatus } from '@/lib/types/parcel';
import { parcelApi } from '@/lib/api/parcels';
import StatusUpdateForm from '@/components/admin/StatusUpdateForm';

export default function StatusUpdatesPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedParcels, setSelectedParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        setLoading(true);
        const courierServiceId = 'demo-courier-service-id';
        const parcelsData = await parcelApi.getAll(courierServiceId);
        setParcels(parcelsData);
      } catch (error) {
        console.error('Failed to fetch parcels:', error);
        setError('Failed to load parcels');
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  const handleParcelSelect = (parcel: Parcel, selected: boolean) => {
    if (selected) {
      setSelectedParcels(prev => [...prev, parcel]);
    } else {
      setSelectedParcels(prev => prev.filter(p => p.id !== parcel.id));
    }
  };

  const handleSelectAll = (status: ParcelStatus, selected: boolean) => {
    const parcelsInStatus = parcels.filter(p => p.status === status);
    if (selected) {
      setSelectedParcels(prev => [...prev, ...parcelsInStatus.filter(p => !prev.find(sp => sp.id === p.id))]);
    } else {
      setSelectedParcels(prev => prev.filter(p => !parcelsInStatus.find(sp => sp.id === p.id)));
    }
  };

  const handleStatusUpdate = async (status: ParcelStatus, location: string, notes: string) => {
    try {
      const updatePromises = selectedParcels.map(parcel =>
        parcelApi.updateStatus(parcel.id, { status, location, notes })
      );
      
      await Promise.all(updatePromises);
      
      // Refresh parcels data
      const courierServiceId = 'demo-courier-service-id';
      const updatedParcels = await parcelApi.getAll(courierServiceId);
      setParcels(updatedParcels);
      
      // Clear selection and hide form
      setSelectedParcels([]);
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Failed to update parcel status');
    }
  };

  const handleCancelUpdate = () => {
    setSelectedParcels([]);
    setShowUpdateForm(false);
  };

  const groupParcelsByStatus = () => {
    const groups: Record<ParcelStatus, Parcel[]> = {
      'Created': [],
      'Picked Up': [],
      'In Transit': [],
      'Out for Delivery': [],
      'Delivered': [],
      'Failed Delivery': [],
      'Returned': []
    };

    parcels.forEach(parcel => {
      if (groups[parcel.status]) {
        groups[parcel.status].push(parcel);
      }
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Status Updates</h1>
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

  const statusGroups = groupParcelsByStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Status Updates</h1>
        {selectedParcels.length > 0 && (
          <button
            onClick={() => setShowUpdateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Update {selectedParcels.length} Parcel{selectedParcels.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {showUpdateForm && (
        <StatusUpdateForm
          selectedParcels={selectedParcels}
          onUpdate={handleStatusUpdate}
          onCancel={handleCancelUpdate}
        />
      )}

      <div className="space-y-6">
        {Object.entries(statusGroups).map(([status, statusParcels]) => {
          if (statusParcels.length === 0) return null;

          const isAllSelected = statusParcels.every(parcel => 
            selectedParcels.some(sp => sp.id === parcel.id)
          );
          const isSomeSelected = statusParcels.some(parcel => 
            selectedParcels.some(sp => sp.id === parcel.id)
          );

          return (
            <div key={status} className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={(e) => handleSelectAll(status as ParcelStatus, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <h3 className="text-lg font-medium text-gray-900">{status}</h3>
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {statusParcels.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {statusParcels.map(parcel => {
                  const isSelected = selectedParcels.some(sp => sp.id === parcel.id);
                  
                  return (
                    <div key={parcel.id} className="p-4 flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleParcelSelect(parcel, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {parcel.trackingNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {parcel.recipient.name} • {parcel.recipient.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Created: {new Date(parcel.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {parcels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No parcels found.</p>
        </div>
      )}
    </div>
  );
}
