// src/app/userdashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-md w-96">
      <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
      <button
        onClick={() => router.push("/signin")}
        className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4 hover:bg-blue-600"
      >
        Sign In
      </button>
      <button
        onClick={() => router.push("/signup")}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
      >
        Sign Up
      </button>
    </div>
  );
}
