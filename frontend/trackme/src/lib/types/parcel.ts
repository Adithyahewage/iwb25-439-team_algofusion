export interface Parcel {
  id: string;
  trackingNumber: string;
  courierServiceId: string;
  sender: Sender;
  recipient: Recipient;
  item: Item;
  status: ParcelStatus;
  statusHistory: StatusUpdate[];
  locationHistory: LocationPoint[];
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sender {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Recipient {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Item {
  description: string;
  weight: number;
  dimensions: Dimensions;
  category: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface StatusUpdate {
  status: ParcelStatus;
  location: string;
  notes?: string;
  timestamp: string;
  updatedBy: string;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
  status: ParcelStatus;
}

export type ParcelStatus = 
  | 'Created'
  | 'Picked Up'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Failed Delivery'
  | 'Returned';

export interface CreateParcelRequest {
  sender: Sender;
  recipient: Recipient;
  item: Item;
  estimatedDelivery: string;
}

export interface UpdateStatusRequest {
  status: ParcelStatus;
  location: string;
  notes?: string;
}
