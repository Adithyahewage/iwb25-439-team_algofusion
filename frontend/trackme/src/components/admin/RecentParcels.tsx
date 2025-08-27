import { Parcel } from '@/lib/types/parcel';
import { getStatusConfig } from '@/lib/utils/status';
import { Eye, Calendar } from 'lucide-react';
import Link from 'next/link';

interface RecentParcelsProps {
  parcels: Parcel[];
}

export default function RecentParcels({ parcels }: RecentParcelsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Recent Parcels</h3>
        <Link
          href="/admin/parcels"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </Link>
      </div>
      
      {parcels.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📦</div>
          <p className="text-gray-500">No recent parcels</p>
        </div>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel) => {
            const statusConfig = getStatusConfig(parcel.status);
            
            return (
              <div
                key={parcel.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{statusConfig.icon}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {parcel.trackingNumber}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {parcel.recipient.name} • {parcel.recipient.address}
                    </p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">
                        {formatDate(parcel.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                  
                  <Link
                    href={`/admin/parcels/${parcel.id}`}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {parcels.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            href="/admin/parcels/new"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Parcel
          </Link>
        </div>
      )}
    </div>
  );
}
