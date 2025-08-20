"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Verify() {
  const [message, setMessage] = useState("Verifying...");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }
    fetch(`http://localhost:8081/api/auth/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage("Email verified! Redirecting...");
          setTimeout(() => router.push("/addinfo"), 2000);
        } else {
          setMessage(data.error || "Verification failed.");
        }
      })
      .catch(() => setMessage("Verification failed."));
  }, [router, searchParams]);

  return <div className="text-center mt-10">{message}</div>;
}
