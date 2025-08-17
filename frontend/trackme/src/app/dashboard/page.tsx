"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/status", {
          method: "GET",
          credentials: "include", // ✅ send cookies
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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      router.push("/userdashboard");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md w-96">
      <h1 className="text-2xl font-bold mb-6">
        {username ? `Welcome, ${username}! 🎉` : "Loading..."}
      </h1>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
