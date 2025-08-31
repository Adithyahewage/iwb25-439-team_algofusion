import { Parcel } from '@/lib/types/parcel';
import { getStatusConfig } from '@/lib/utils/status';
import { Eye, Edit, Trash2, Calendar, MapPin, User } from 'lucide-react';
import Link from 'next/link';

interface ParcelListProps {
  parcels: Parcel[];
  onDelete: (parcelId: string) => void;
  onRefresh: () => void;
}

export default function ParcelList({ parcels, onDelete, onRefresh }: ParcelListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (parcels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parcels found</h3>
          <p className="text-gray-500 mb-6">
            {parcels.length === 0 ? 'No parcels match your current filters.' : 'Create your first parcel to get started.'}
          </p>
          <Link
            href="/admin/parcels/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Parcel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tracking Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estimated Delivery
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parcels.map((parcel) => {
              const statusConfig = getStatusConfig(parcel.status);
              
              return (
                <tr key={parcel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {parcel.trackingNumber}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {parcel.item.description}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {parcel.recipient.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parcel.recipient.phone}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500 truncate max-w-xs">
                        {parcel.recipient.address}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <span className="mr-1">{statusConfig.icon}</span>
                      {statusConfig.label}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {formatDate(parcel.createdAt)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parcel.estimatedDelivery ? formatDate(parcel.estimatedDelivery) : 'Not set'}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/parcels/${parcel.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      
                      <Link
                        href={`/admin/parcels/${parcel.id}/edit`}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit parcel"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      
                      <button
                        onClick={() => onDelete(parcel.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete parcel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination placeholder */}
      {parcels.length > 10 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{parcels.length}</span> of{' '}
                <span className="font-medium">{parcels.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
