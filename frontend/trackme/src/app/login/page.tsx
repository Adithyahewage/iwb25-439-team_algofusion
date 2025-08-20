"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      email: form.email.value,
      password: form.password.value,
    };
    const res = await fetch("http://localhost:8081/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (res.ok) {
      setMessage(result.message || "Login successful! Redirecting...");
      setTimeout(() => router.push("/"), 2000);
    } else {
      setMessage(result.error || "Login failed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm mx-auto mt-10">
      <input name="email" type="email" placeholder="Email" required className="border p-2" />
      <input name="password" type="password" placeholder="Password" required className="border p-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
      <div>{message}</div>
    </form>
  );
}