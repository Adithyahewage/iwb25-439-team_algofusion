"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePackage() {
  const [form, setForm] = useState({
    sender: "",
    receiver: "",
    origin: "",
    destination: "",
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ send JWT cookie
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("✅ Package created successfully!");
        setForm({ sender: "", receiver: "", origin: "", destination: "" });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        const err = await res.json();
        setMessage("❌ " + err.error);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("❌ Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">📦 Create New Package</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-96 bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          name="sender"
          placeholder="Sender Name"
          value={form.sender}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="receiver"
          placeholder="Receiver Name"
          value={form.receiver}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="origin"
          placeholder="Origin"
          value={form.origin}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Package
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
