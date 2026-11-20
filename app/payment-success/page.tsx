// payment success page
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");
  const router = useRouter();
  const { token } = useAuth();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (bookingId && token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId }),
      }).then(() => setDone(true));
    }
  }, [bookingId, token]);

  return (
    <div className="min-h- flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-emerald-600">Payment Successful!</h1>
      <p className="mt-3 text-gray-600">Your booking is confirmed. Check My Rentals in dashboard.</p>
      <button onClick={() => router.push("/dashboard/customer")} className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-full">Go to My Rentals</button>
    </div>
  );
}
