// owner dashboard - add + my equipment + rentals + analytics
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function OwnerDashboard() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [myEq, setMyEq] = useState<any[]>([]);
  const [myRentals, setMyRentals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalEquipment: 0, totalBookings: 0, totalEarnings: 0, monthly: [] });
  const [form, setForm] = useState({ name: "", description: "", category: "Construction Equipment", location: "Dhaka", rentalPrice: "", rentalType: "Daily", availableQuantity: 1, condition: "Good", brand: "", model: "", image: "", terms: "" });

  const load = () => {
    if (!token) return;
    fetch(`${API}/equipment/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setMyEq(d.equipments || []));
    fetch(`${API}/bookings/owner`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setMyRentals(d.bookings || []));
    fetch(`${API}/analytics/owner`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setStats(d));
  };
  useEffect(() => { load(); }, [token]);

  const addEq = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${API}/equipment`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...form, rentalPrice: Number(form.rentalPrice) }) });
    if (!res.ok) return toast.error("Add failed");
    toast.success("Equipment added - waiting for approval");
    setTab("my");
    load();
  };

  const delEq = async (id: string) => {
    await fetch(`${API}/equipment/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    toast.success("Deleted");
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Owner Dashboard</h1>
      <p className="text-gray-500">Welcome, {user?.name}</p>
      <div className="flex gap-2 mt-5 flex-wrap">
        <button onClick={() => setTab("overview")} className={`px-4 py-2 rounded-full ${tab === "overview" ? "bg-emerald-600 text-white" : "border"}`}>Overview</button>
        <button onClick={() => setTab("add")} className={`px-4 py-2 rounded-full ${tab === "add" ? "bg-emerald-600 text-white" : "border"}`}>Add Equipment</button>
        <button onClick={() => setTab("my")} className={`px-4 py-2 rounded-full ${tab === "my" ? "bg-emerald-600 text-white" : "border"}`}>My Equipment</button>
        <button onClick={() => setTab("rentals")} className={`px-4 py-2 rounded-full ${tab === "rentals" ? "bg-emerald-600 text-white" : "border"}`}>My Equipment Rental</button>
      </div>

      {tab === "overview" && (
        <div className="mt-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Total Equipment</p><p className="text-2xl font-bold">{stats.totalEquipment}</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Total Bookings</p><p className="text-2xl font-bold">{stats.totalBookings}</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Total Earnings</p><p className="text-2xl font-bold">৳{stats.totalEarnings}</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow mt-4 h-72">
            <h3 className="font-bold mb-2">Monthly Earnings</h3>
            <ResponsiveContainer width="100%" height="90%"><BarChart data={stats.monthly}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="earnings" fill="#059669" /></BarChart></ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "add" && (
        <form onSubmit={addEq} className="bg-white p-5 rounded-2xl shadow mt-5 grid md:grid-cols-2 gap-3 max-w-3xl">
          <input required className="border p-2 rounded" placeholder="Equipment Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required className="border p-2 rounded" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <select className="border p-2 rounded" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Construction Equipment</option><option>Photography Equipment</option><option>Vehicles & Transportation</option><option>Agriculture Equipment</option><option>Electronics</option><option>Event Equipment</option></select>
          <select className="border p-2 rounded" value={form.rentalType} onChange={(e) => setForm({ ...form, rentalType: e.target.value })}><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
          <input required type="number" className="border p-2 rounded" placeholder="Rental Price" value={form.rentalPrice} onChange={(e) => setForm({ ...form, rentalPrice: e.target.value })} />
          <input required type="number" className="border p-2 rounded" placeholder="Available Quantity" value={form.availableQuantity} onChange={(e) => setForm({ ...form, availableQuantity: Number(e.target.value) })} />
          <input className="border p-2 rounded" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Condition - Good / New" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} />
          <input required className="border p-2 rounded" placeholder="Image Link / ImgBB Link" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <textarea className="border p-2 rounded md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className="border p-2 rounded md:col-span-2" placeholder="Rental Terms" value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} />
          <button className="bg-emerald-600 text-white py-2 rounded-full md:col-span-2">Publish Equipment - Status Pending</button>
        </form>
      )}

      {tab === "my" && (
        <div className="overflow-x-auto mt-5 bg-white rounded-2xl shadow">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="p-3 text-left">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Qty</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
            <tbody>{myEq.map((it) => (<tr key={it._id} className="border-t"><td className="p-3">{it.name}</td><td className="p-3">{it.category}</td><td className="p-3">৳{it.rentalPrice}</td><td className="p-3">{it.availableQuantity}</td><td className="p-3">{it.status}</td><td className="p-3"><button onClick={() => delEq(it._id)} className="text-red-500">Delete</button></td></tr>))}</tbody></table>
          {myEq.length === 0 && <p className="p-4 text-center text-gray-500">No equipment yet</p>}
        </div>
      )}

      {tab === "rentals" && (
        <div className="overflow-x-auto mt-5 bg-white rounded-2xl shadow">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="p-3 text-left">Customer</th><th className="p-3">Equipment</th><th className="p-3">Duration</th><th className="p-3">Qty</th><th className="p-3">Amount</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr></thead>
            <tbody>{myRentals.map((b) => (<tr key={b._id} className="border-t"><td className="p-3">{b.customer?.name} - {b.customer?.email}</td><td className="p-3">{b.equipment?.name}</td><td className="p-3">{new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}</td><td className="p-3">{b.quantity}</td><td className="p-3">৳{b.totalAmount}</td><td className="p-3">{b.paymentStatus}</td><td className="p-3">{b.bookingStatus}</td></tr>))}</tbody></table>
          {myRentals.length === 0 && <p className="p-4 text-center text-gray-500">No rentals yet</p>}
        </div>
      )}
    </div>
  );
}
