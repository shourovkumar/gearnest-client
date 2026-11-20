// dashboard - role onujayi dekhabe
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [myEquipments, setMyEquipments] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<any[]>([]);
  const [allEquipments, setAllEquipments] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  // add equipment er jonno
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cameras");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("Dhaka");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (user?.role === "owner") {
      fetch(`${API}/equipment/my`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => setMyEquipments(data.equipments || []));
      fetch(`${API}/bookings/owner`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => setOwnerBookings(data.bookings || []));
    }
    if (user?.role === "customer") {
      fetch(`${API}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => setMyBookings(data.bookings || []));
    }
    if (user?.role === "admin") {
      fetch(`${API}/equipment`)
        .then((res) => res.json())
        .then((data) => setAllEquipments(data.equipments || []));
      fetch(`${API}/bookings`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.json())
        .then((data) => setMyBookings(data.bookings || []));
    }
  }, [token, user]);

  const handleAddEquipment = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${API}/equipment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description, category, pricePerDay: Number(price), image, location }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message);
      return;
    }
    setMsg("Equipment added!");
    setName(""); setDescription(""); setPrice(""); setImage("");
    window.location.reload();
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-500 mt-1">Hi, {user.name} - {user.role}</p>

      {/* ADMIN */}
      {user.role === "admin" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-emerald-600 text-white p-4 rounded"><p>Total Equipment</p><p className="text-2xl font-bold">{allEquipments.length}</p></div>
            <div className="bg-white p-4 rounded shadow"><p>Total Bookings</p><p className="text-2xl font-bold">{myBookings.length}</p></div>
            <div className="bg-white p-4 rounded shadow"><p>Your Role</p><p className="text-2xl font-bold">Admin</p></div>
          </div>
          <h2 className="text-xl font-bold mt-6">All Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            {allEquipments.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm">{item.category} - ৳{item.pricePerDay}/day</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OWNER */}
      {user.role === "owner" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-emerald-600 text-white p-4 rounded"><p>My Equipment</p><p className="text-2xl font-bold">{myEquipments.length}</p></div>
            <div className="bg-white p-4 rounded shadow"><p>Booking Requests</p><p className="text-2xl font-bold">{ownerBookings.length}</p></div>
          </div>

          <h2 className="text-xl font-bold mt-6">Add New Equipment</h2>
          <form onSubmit={handleAddEquipment} className="bg-white p-4 rounded shadow flex flex-col gap-2 mt-3 max-w-xl">
            <input className="border p-2 rounded" placeholder="Name - Canon Camera" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <select className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Cameras</option><option>Tools</option><option>Outdoor</option><option>Audio</option>
            </select>
            <input className="border p-2 rounded" placeholder="Price per day - 1200" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Image URL - https://..." value={image} onChange={(e) => setImage(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Location - Dhaka" value={location} onChange={(e) => setLocation(e.target.value)} />
            {msg && <p className="text-sm text-emerald-600">{msg}</p>}
            <button className="bg-emerald-600 text-white py-2 rounded">Add Equipment</button>
          </form>

          <h2 className="text-xl font-bold mt-6">My Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            {myEquipments.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm">৳{item.pricePerDay}/day - {item.category}</p>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mt-6">Booking Requests</h2>
          {ownerBookings.map((b) => (
            <div key={b._id} className="bg-white p-4 rounded shadow mt-2">
              <p>{b.equipment?.name} - {b.customer?.name} - {b.startDate?.slice(0, 10)} to {b.endDate?.slice(0, 10)} - ৳{b.totalPrice} - {b.status}</p>
            </div>
          ))}
        </div>
      )}

      {/* CUSTOMER */}
      {user.role === "customer" && (
        <div>
          <h2 className="text-xl font-bold mt-6">My Bookings - {myBookings.length} ta</h2>
          {myBookings.map((b) => (
            <div key={b._id} className="bg-white p-4 rounded shadow mt-3">
              <h3 className="font-bold">{b.equipment?.name}</h3>
              <p className="text-sm">{b.startDate?.slice(0, 10)} to {b.endDate?.slice(0, 10)} - {b.totalDays} days - ৳{b.totalPrice}</p>
              <p className="text-sm">Status: {b.status} - Payment: {b.paymentStatus}</p>
            </div>
          ))}
          {myBookings.length === 0 && <p className="mt-3">No booking yet. Equipment page theke Book koro.</p>}
        </div>
      )}
    </div>
  );
}
