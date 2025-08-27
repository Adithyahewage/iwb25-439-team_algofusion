import { Parcel } from '@/lib/types/parcel';
import { getStatusConfig, statusOrder } from '@/lib/utils/status';

interface StatusOverviewProps {
  parcels: Parcel[];
}

export default function StatusOverview({ parcels }: StatusOverviewProps) {
  const getStatusCount = (status: string) => {
    return parcels.filter(parcel => parcel.status === status).length;
  };

  const totalParcels = parcels.length;

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Status Overview</h3>
      
      {totalParcels === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <p className="text-gray-500">No parcels found</p>
          <p className="text-sm text-gray-400 mt-1">Create your first parcel to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {statusOrder.map((status) => {
            const count = getStatusCount(status);
            const percentage = totalParcels > 0 ? (count / totalParcels) * 100 : 0;
            const config = getStatusConfig(status);
            
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{config.label}</p>
                    <p className="text-sm text-gray-500">{config.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Parcels</span>
          <span className="text-lg font-bold text-gray-900">{totalParcels}</span>
        </div>
      </div>
    </div>
  );
}
