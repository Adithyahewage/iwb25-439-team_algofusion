"use client";
import { useState } from "react";

export default function Signup() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };
    const res = await fetch("http://localhost:8081/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (res.ok) {
      setMessage(result.message || "Check your email for a verification link.");
    } else {
      setMessage(result.error || "Signup failed.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 max-w-sm mx-auto mt-10"
    >
      <input name="name" placeholder="Name" required className="border p-2" />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="border p-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Sign Up
      </button>
      <div>{message}</div>
    </form>
  );
}
