"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchIcon, ClockIcon, MapPinIcon, ShareIcon, PackageIcon, CheckCircleIcon } from "../../components/icons";

// Mock data for demonstration
const mockTrackingData = {
  "TRK123456789": {
    trackingNumber: "TRK123456789",
    status: "In Transit",
    courier: "Express Delivery Co.",
    origin: "Colombo",
    destination: "Horana",
    estimatedDelivery: "2024-01-15",
    timeline: [
      {
        status: "Package Picked Up",
        location: "New York, NY",
        timestamp: "2024-01-10 09:30 AM",
        completed: true
      },
      {
        status: "In Transit",
        location: "Chicago, IL",
        timestamp: "2024-01-12 02:15 PM",
        completed: true
      },
      {
        status: "Out for Delivery",
        location: "Los Angeles, CA",
        timestamp: "2024-01-15 08:00 AM",
        completed: false
      },
      {
        status: "Delivered",
        location: "Los Angeles, CA",
        timestamp: "Pending",
        completed: false
      }
    ]
  }
};

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      const result = mockTrackingData[trackingNumber as keyof typeof mockTrackingData];
      if (result) {
        setTrackingResult(result);
      } else {
        setError("Tracking number not found. Please check and try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const copyTrackingLink = () => {
    const url = `${window.location.origin}/track?number=${trackingResult?.trackingNumber}`;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <PackageIcon className="h-8 w-8" />
              <span className="font-semibold text-xl text-gray-900">TrackMe</span>
            </Link>
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Track Your Package
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your tracking number to get real-time updates on your package delivery status. 
            No registration required.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (e.g., TRK123456789)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Searching..." : "Track Package"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-6">
            {/* Package Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Package Details
                  </h2>
                  <p className="text-sm text-gray-500">
                    Tracking Number: {trackingResult.trackingNumber}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={copyTrackingLink}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Status:</span>
                    <span className="text-sm text-gray-900 font-medium">{trackingResult.status}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Courier:</span>
                    <span className="text-sm text-gray-900">{trackingResult.courier}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Origin:</span>
                    <span className="text-sm text-gray-900">{trackingResult.origin}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-24">Destination:</span>
                    <span className="text-sm text-gray-900">{trackingResult.destination}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">
                    Estimated Delivery: {trackingResult.estimatedDelivery}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Timeline</h3>
              <div className="space-y-6">
                {trackingResult.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      {event.completed ? (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{event.status}</h4>
                        <span className="text-sm text-gray-500">{event.timestamp}</span>
                      </div>
                      <div className="mt-1 flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose TrackMe?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <SearchIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">No Registration Required</h4>
              <p className="text-sm text-gray-600">Track parcels using just the tracking number</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShareIcon className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Easy Sharing</h4>
              <p className="text-sm text-gray-600">Copy tracking links to share with others</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Real-time Updates</h4>
              <p className="text-sm text-gray-600">Live status changes and notifications</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2024 TrackMe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
