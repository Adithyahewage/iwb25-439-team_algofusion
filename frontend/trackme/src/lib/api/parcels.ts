// import apiClient from './client';
import { Parcel, CreateParcelRequest, UpdateStatusRequest } from '../types/parcel';

// Mock parcel data for development
const mockParcels: Parcel[] = [
  {
    id: '1',
    trackingNumber: 'TRK001234567',
    courierServiceId: 'demo-courier-service-id',
    sender: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Sender St, Colombo, Sri Lanka'
    },
    recipient: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      address: '456 Recipient Ave, Galle, Sri Lanka'
    },
    item: {
      description: 'Electronics Package',
      weight: 2.5,
      dimensions: { length: 30, width: 20, height: 15 },
      category: 'Electronics'
    },
    status: 'In Transit',
    statusHistory: [
      {
        status: 'Created',
        location: 'Colombo Sorting Center',
        notes: 'Parcel created and ready for pickup',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        updatedBy: 'admin@trackme.com'
      },
      {
        status: 'Picked Up',
        location: 'Colombo Collection Point',
        notes: 'Parcel collected from sender',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        updatedBy: 'admin@trackme.com'
      },
      {
        status: 'In Transit',
        location: 'Colombo Sorting Center',
        notes: 'Parcel in transit to destination',
        timestamp: new Date().toISOString(),
        updatedBy: 'admin@trackme.com'
      }
    ],
    locationHistory: [
      {
        latitude: 6.9271,
        longitude: 79.8612,
        address: 'Colombo Sorting Center',
        timestamp: new Date().toISOString(),
        status: 'In Transit'
      }
    ],
    estimatedDelivery: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    trackingNumber: 'TRK001234568',
    courierServiceId: 'demo-courier-service-id',
    sender: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1122334455',
      address: '789 Sender Rd, Kandy, Sri Lanka'
    },
    recipient: {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+5544332211',
      address: '321 Recipient Blvd, Colombo, Sri Lanka'
    },
    item: {
      description: 'Clothing Package',
      weight: 1.2,
      dimensions: { length: 25, width: 15, height: 10 },
      category: 'Clothing'
    },
    status: 'Delivered',
    statusHistory: [
      {
        status: 'Created',
        location: 'Kandy Collection Point',
        notes: 'Parcel created',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        updatedBy: 'admin@trackme.com'
      },
      {
        status: 'Picked Up',
        location: 'Kandy Collection Point',
        notes: 'Parcel collected',
        timestamp: new Date(Date.now() - 129600000).toISOString(),
        updatedBy: 'admin@trackme.com'
      },
      {
        status: 'In Transit',
        location: 'Colombo Sorting Center',
        notes: 'Parcel in transit',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        updatedBy: 'admin@trackme.com'
      },
      {
        status: 'Out for Delivery',
        location: 'Colombo Delivery Hub',
        notes: 'Out for final delivery',
        timestamp: new Date(Date.now() - 43200000).toISOString(),
        updatedBy: 'admin@trackme.com'
      },
      {
        status: 'Delivered',
        location: 'Colombo, Sri Lanka',
        notes: 'Successfully delivered to recipient',
        timestamp: new Date().toISOString(),
        updatedBy: 'admin@trackme.com'
      }
    ],
    locationHistory: [],
    estimatedDelivery: new Date().toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    trackingNumber: 'TRK001234569',
    courierServiceId: 'demo-courier-service-id',
    sender: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '+9988776655',
      address: '555 Sender Lane, Galle, Sri Lanka'
    },
    recipient: {
      name: 'Diana Prince',
      email: 'diana@example.com',
      phone: '+6677889900',
      address: '777 Recipient Way, Kandy, Sri Lanka'
    },
    item: {
      description: 'Books Package',
      weight: 3.0,
      dimensions: { length: 35, width: 25, height: 20 },
      category: 'Books'
    },
    status: 'Created',
    statusHistory: [
      {
        status: 'Created',
        location: 'Galle Collection Point',
        notes: 'Parcel created and ready for pickup',
        timestamp: new Date().toISOString(),
        updatedBy: 'admin@trackme.com'
      }
    ],
    locationHistory: [],
    estimatedDelivery: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const parcelApi = {
  // Create new parcel
  async create(data: CreateParcelRequest): Promise<Parcel> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newParcel: Parcel = {
      id: Date.now().toString(),
      trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      courierServiceId: 'demo-courier-service-id',
      ...data,
      status: 'Created',
      statusHistory: [{
        status: 'Created',
        location: 'Collection Point',
        notes: 'Parcel created',
        timestamp: new Date().toISOString(),
        updatedBy: 'admin@trackme.com'
      }],
      locationHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockParcels.push(newParcel);
    return newParcel;
  },

  // Get all parcels for courier service
  async getAll(courierServiceId: string): Promise<Parcel[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockParcels;
  },

  // Get parcel by ID
  async getById(id: string): Promise<Parcel> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const parcel = mockParcels.find(p => p.id === id);
    if (!parcel) throw new Error('Parcel not found');
    return parcel;
  },

  // Get parcel by tracking number
  async getByTrackingNumber(trackingNumber: string): Promise<Parcel> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const parcel = mockParcels.find(p => p.trackingNumber === trackingNumber);
    if (!parcel) throw new Error('Parcel not found');
    return parcel;
  },

  // Update parcel
  async update(id: string, data: Partial<Parcel>): Promise<Parcel> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const index = mockParcels.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Parcel not found');
    mockParcels[index] = { ...mockParcels[index], ...data, updatedAt: new Date().toISOString() };
    return mockParcels[index];
  },

  // Delete parcel
  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockParcels.findIndex(p => p.id === id);
    if (index !== -1) {
      mockParcels.splice(index, 1);
    }
  },

  // Update parcel status
  async updateStatus(id: string, statusUpdate: UpdateStatusRequest): Promise<Parcel> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const parcel = mockParcels.find(p => p.id === id);
    if (!parcel) throw new Error('Parcel not found');
    
    const newStatusUpdate = {
      ...statusUpdate,
      timestamp: new Date().toISOString(),
      updatedBy: 'admin@trackme.com'
    };
    
    parcel.status = statusUpdate.status;
    parcel.statusHistory.push(newStatusUpdate);
    parcel.updatedAt = new Date().toISOString();
    
    return parcel;
  },

  // Get parcel status history
  async getStatusHistory(id: string): Promise<Parcel['statusHistory']> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const parcel = mockParcels.find(p => p.id === id);
    if (!parcel) throw new Error('Parcel not found');
    return parcel.statusHistory;
  },

  // Get parcel timeline
  async getTimeline(id: string): Promise<{
    statusHistory: Parcel['statusHistory'];
    locationHistory: Parcel['locationHistory'];
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const parcel = mockParcels.find(p => p.id === id);
    if (!parcel) throw new Error('Parcel not found');
    return {
      statusHistory: parcel.statusHistory,
      locationHistory: parcel.locationHistory
    };
  },

  // Search parcels
  async search(query: string, courierServiceId: string): Promise<Parcel[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockParcels.filter(parcel =>
      parcel.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
      parcel.recipient.name.toLowerCase().includes(query.toLowerCase()) ||
      parcel.sender.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Get parcels by status
  async getByStatus(status: string, courierServiceId: string): Promise<Parcel[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockParcels.filter(parcel => parcel.status === status);
  }
};
