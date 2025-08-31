import { ParcelStatus } from '../types/parcel';

export const statusConfig = {
  'Created': {
    label: 'Created',
    color: 'bg-gray-100 text-gray-800',
    icon: '📦',
    description: 'Parcel has been created and is ready for pickup'
  },
  'Picked Up': {
    label: 'Picked Up',
    color: 'bg-blue-100 text-blue-800',
    icon: '🚚',
    description: 'Parcel has been collected from sender'
  },
  'In Transit': {
    label: 'In Transit',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '✈️',
    description: 'Parcel is being transported to destination'
  },
  'Out for Delivery': {
    label: 'Out for Delivery',
    color: 'bg-orange-100 text-orange-800',
    icon: '🚛',
    description: 'Parcel is out for final delivery'
  },
  'Delivered': {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    description: 'Parcel has been successfully delivered'
  },
  'Failed Delivery': {
    label: 'Failed Delivery',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
    description: 'Delivery attempt was unsuccessful'
  },
  'Returned': {
    label: 'Returned',
    color: 'bg-purple-100 text-purple-800',
    icon: '↩️',
    description: 'Parcel has been returned to sender'
  }
} as const;

export function getStatusConfig(status: ParcelStatus) {
  return statusConfig[status];
}

export function getStatusColor(status: ParcelStatus) {
  return statusConfig[status].color;
}

export function getStatusIcon(status: ParcelStatus) {
  return statusConfig[status].icon;
}

export function getStatusDescription(status: ParcelStatus) {
  return statusConfig[status].description;
}

export const statusOrder: ParcelStatus[] = [
  'Created',
  'Picked Up',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Failed Delivery',
  'Returned'
];

export function getNextStatus(currentStatus: ParcelStatus): ParcelStatus | null {
  const currentIndex = statusOrder.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === statusOrder.length - 1) {
    return null;
  }
  return statusOrder[currentIndex + 1];
}

export function getPreviousStatus(currentStatus: ParcelStatus): ParcelStatus | null {
  const currentIndex = statusOrder.indexOf(currentStatus);
  if (currentIndex <= 0) {
    return null;
  }
  return statusOrder[currentIndex - 1];
}
