"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddInfo() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      phone: form.phone.value,
      address: form.address.value,
      logo: form.logo.value,
      serviceAreas: form.serviceAreas.value.split(",").map((s: string) => s.trim()),
    };
    const res = await fetch("http://localhost:8081/api/auth/addinfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (res.ok) {
      setMessage(result.message || "Info added! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage(result.error || "Failed to add info.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
      <input name="phone" placeholder="Phone" required className="border p-2" />
      <input name="address" placeholder="Address" required className="border p-2" />
      <input name="logo" placeholder="Logo URL" className="border p-2" />
      <input name="serviceAreas" placeholder="Service Areas (comma separated)" className="border p-2" />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Info</button>
      <div>{message}</div>
    </form>
  );
}