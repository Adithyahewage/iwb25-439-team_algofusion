import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DashboardStatsProps {
  totalParcels: number;
  deliveredParcels: number;
  inTransitParcels: number;
  pendingParcels: number;
  failedParcels: number;
}

export default function DashboardStats({
  totalParcels,
  deliveredParcels,
  inTransitParcels,
  pendingParcels,
  failedParcels
}: DashboardStatsProps) {
  const stats = [
    {
      name: 'Total Parcels',
      value: totalParcels,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Delivered',
      value: deliveredParcels,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'In Transit',
      value: inTransitParcels,
      icon: Truck,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      name: 'Pending',
      value: pendingParcels,
      icon: Clock,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      name: 'Failed/Returned',
      value: failedParcels,
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            
            {/* Progress indicator for delivered parcels */}
            {stat.name === 'Delivered' && totalParcels > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-gray-900">
                    {Math.round((deliveredParcels / totalParcels) * 100)}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(deliveredParcels / totalParcels) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
