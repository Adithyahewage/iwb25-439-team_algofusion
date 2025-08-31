"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardStats from "@/components/admin/DashboardStats";
import StatusOverview from "@/components/admin/StatusOverview";
import { Parcel } from "@/lib/types/parcel";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState(""); // For trackingId search
  const [searchResult, setSearchResult] = useState<Parcel | null>(null);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/status", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.username);
        } else {
          router.push("/signin");
        }
      } catch (err) {
        console.error("Error fetching user", err);
        router.push("/signin");
      }
    };
    fetchUser();
  }, [router]);

  // Fetch parcels for logged-in user
  useEffect(() => {
    if (!username) return;

    const fetchParcels = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/packages/list", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch parcels");

        const data: Parcel[] = await res.json();
        const userParcels = data.filter((p) => p.username === username);
        setParcels(userParcels);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, [username]);

  // Delete package
  const handleDelete = async (trackingId: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/packages/${trackingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete package");

      // Remove from UI
      setParcels((prev) => prev.filter((p) => p.trackingId !== trackingId));
      setSearchResult(null); // clear search if deleted
    } catch (err) {
      console.error(err);
      alert("Failed to delete package");
    }
  };

  // Search package by trackingId
  const handleSearch = () => {
    if (!searchId) return;
    const found = parcels.find((p) => p.trackingId === searchId);
    setSearchResult(found || null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      router.push("/");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const handleRefresh = async () => {
    if (!username) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/packages/list", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch parcels");

      const data: Parcel[] = await res.json();
      const userParcels = data.filter((p) => p.username === username);
      setParcels(userParcels);
      setSearchResult(null); // clear search
    } catch (err) {
      console.error(err);
      setError("Failed to refresh data.");
    } finally {
      setLoading(false);
    }
  };

  // Dashboard calculations
  const totalParcels = parcels.length;
  const deliveredParcels = parcels.filter((p) => p.status === "Delivered").length;
  const inTransitParcels = parcels.filter((p) => p.status === "In Transit").length;
  const pendingParcels = parcels.filter((p) => p.status === "Pending").length;
  const failedParcels = parcels.filter((p) =>
    ["Failed Delivery", "Returned"].includes(p.status)
  ).length;

  // Decide what to show: search result or full list
  const displayParcels = searchResult ? [searchResult] : parcels;

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {username ? `Welcome, ${username}! 🎉` : "Loading..."}
      </h1>

      <div className="flex gap-4 mb-6 w-full">
        <Link
          href="/dashboard/create-package"
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-center"
        >
          Create Package
        </Link>
        <button
          onClick={handleLogout}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6 w-full">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Search by Tracking ID"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
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

        <div className="mt-6 space-y-4 w-full">
          {displayParcels.length === 0 ? (
            <p className="text-center text-gray-500">No packages found.</p>
          ) : (
            displayParcels.map((p) => (
              <div
                key={p.trackingId}
                className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:bg-gray-50"
              >
                <div className="flex flex-col">
                  <p>
                    <strong>Tracking ID:</strong> {p.trackingId}
                  </p>
                  <p>
                    <strong>Sender:</strong> {p.sender}
                  </p>
                  <p>
                    <strong>Receiver:</strong> {p.receiver}
                  </p>
                  <p>
                    <strong>Origin:</strong> {p.origin}
                  </p>
                  <p>
                    <strong>Destination:</strong> {p.destination}
                  </p>
                  <p>
                    <strong>Status:</strong> {p.status}
                  </p>
                  <p>
                    <strong>Created At:</strong> {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(p.trackingId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
