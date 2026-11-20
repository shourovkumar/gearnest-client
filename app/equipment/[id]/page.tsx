// ekta equipment er details + booking
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function DetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [startDate, setStartDate] = useState("2026-11-25");
  const [endDate, setEndDate] = useState("2026-11-27");
  const [msg, setMsg] = useState("");
  const { token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.equipment));
  }, [id]);

  const handleBooking = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (user?.role !== "customer") {
      setMsg("Only customer can book. Login as customer.");
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ equipmentId: id, startDate, endDate }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message);
      return;
    }
    setMsg(`Booking success! Total: ৳${data.booking.totalPrice} for ${data.booking.totalDays} days`);
  };

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <img src={item.image || "https://via.placeholder.com/600x400?text=GearNest"} alt={item.name} className="w-full h-80 object-cover rounded" />
      <div>
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-gray-500 mt-1">{item.category} - {item.location}</p>
        <p className="mt-3">{item.description}</p>
        <p className="text-emerald-600 font-bold text-2xl mt-3">৳{item.pricePerDay} / day</p>
        <p className="text-sm mt-1">Owner: {item.owner?.name}</p>

        <div className="bg-gray-50 p-4 rounded mt-4 flex flex-col gap-2">
          <label>Start Date</label>
          <input type="date" className="border p-2 rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <label>End Date</label>
          <input type="date" className="border p-2 rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          {msg && <p className="text-sm text-emerald-600">{msg}</p>}
          <button onClick={handleBooking} className="bg-emerald-600 text-white py-2 rounded mt-2">Book Now</button>
        </div>
      </div>
    </div>
  );
}
