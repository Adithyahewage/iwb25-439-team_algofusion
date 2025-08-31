"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardStats from '@/components/admin/DashboardStats';
import StatusOverview from '@/components/admin/StatusOverview';
import RecentParcels from '@/components/admin/RecentParcels';
import { Parcel } from '@/lib/types/parcel';

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/status", {
          method: "GET",
          credentials: "include", // send cookies
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        } else {
          router.push("/signin"); // not logged in → back to login
        }
      } catch (err) {
        console.error("Error fetching user", err);
        router.push("/signin");
      }
    };

    fetchUser();
  }, [router]);

  // Fetch dashboard parcels
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/packages/list", {
          method: "GET",
          credentials: "include", // send cookies
        });

        if (!res.ok) {
          throw new Error("Failed to fetch parcels");
        }

        const data: Parcel[] = await res.json();
        setParcels(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please login again.");
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST", // or GET depending on backend
        credentials: "include",
      });
      router.push("/signin");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/packages/list", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch parcels");
      }

      const data: Parcel[] = await res.json();
      setParcels(data);
    } catch (err) {
      console.error(err);
      setError("Failed to refresh data. Please login again.");
      //router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  // Dashboard calculations
  const totalParcels = parcels.length;
  const deliveredParcels = parcels.filter(p => p.status === 'Delivered').length;
  const inTransitParcels = parcels.filter(p => p.status === 'In Transit').length;
  const pendingParcels = parcels.filter(p => p.status === 'Created').length;
  const failedParcels = parcels.filter(p => ['Failed Delivery', 'Returned'].includes(p.status)).length;

  const recentParcels = parcels
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {username ? `Welcome, ${username}! 🎉` : "Loading..."}
      </h1>

      <div className="flex gap-4 mb-6 w-full">
        <Link href="/dashboard/create-package" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-center">
          Create Package
        </Link>
        <button
          onClick={handleLogout}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        <DashboardStats
          totalParcels={totalParcels}
          deliveredParcels={deliveredParcels}
          inTransitParcels={inTransitParcels}
          pendingParcels={pendingParcels}
          failedParcels={failedParcels}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusOverview parcels={parcels} />
          <RecentParcels parcels={recentParcels} />
        </div>
      </div>
    </div>
  );
}
