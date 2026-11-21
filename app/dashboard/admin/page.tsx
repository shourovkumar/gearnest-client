// admin dashboard - users + equipment + rentals + analytics
"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ totalUsers: 0, totalEquipment: 0, totalBookings: 0, pendingApprovals: 0, completed: 0, totalRevenue: 0, monthly: [] });
  const [profile, setProfile] = useState({ name: "", photo: "", phone: "", address: "" });

  const load = () => {
    if (!token) return;
    fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setUsers(d.users || []));
    fetch(`${API}/equipment/admin/all`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setEquipments(d.equipments || []));
    fetch(`${API}/bookings/all`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setRentals(d.bookings || []));
    fetch(`${API}/analytics/admin`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setStats(d));
  };
  useEffect(() => {
    load();
    if (user) setProfile({ name: user.name || "", photo: (user as any).photo || "", phone: (user as any).phone || "", address: (user as any).address || "" });
  }, [token, user]);

  const changeRole = async (id: string, role: string) => {
    await fetch(`${API}/users/${id}/role`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ role }) });
    toast.success("Role updated");
    load();
  };

  const changeStatus = async (id: string, status: string) => {
    await fetch(`${API}/equipment/${id}/status`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) });
    toast.success("Status updated");
    load();
  };

  const delEq = async (id: string) => {
    await fetch(`${API}/equipment/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    toast.success("Deleted");
    load();
  };

  const saveProfile = async (e: any) => {
    e.preventDefault();
    await fetch(`${API}/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(profile) });
    toast.success("Profile updated");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500">Welcome, {user?.name}</p>
      <div className="flex gap-2 mt-5 flex-wrap">
        <button onClick={() => setTab("overview")} className={`px-4 py-2 rounded-full ${tab === "overview" ? "bg-emerald-600 text-white" : "border"}`}>Overview</button>
        <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-full ${tab === "users" ? "bg-emerald-600 text-white" : "border"}`}>All Users</button>
        <button onClick={() => setTab("eq")} className={`px-4 py-2 rounded-full ${tab === "eq" ? "bg-emerald-600 text-white" : "border"}`}>All Equipment</button>
        <button onClick={() => setTab("rentals")} className={`px-4 py-2 rounded-full ${tab === "rentals" ? "bg-emerald-600 text-white" : "border"}`}>All Rentals</button>
        <button onClick={() => setTab("profile")} className={`px-4 py-2 rounded-full ${tab === "profile" ? "bg-emerald-600 text-white" : "border"}`}>My Profile</button>
      </div>

      {tab === "overview" && (
        <div className="mt-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Total Users</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Total Equipment</p><p className="text-2xl font-bold">{stats.totalEquipment}</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Total Bookings</p><p className="text-2xl font-bold">{stats.totalBookings}</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Pending Approvals</p><p className="text-2xl font-bold">{stats.pendingApprovals}</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Completed Rentals</p><p className="text-2xl font-bold">{stats.completed}</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-gray-500">Total Revenue</p><p className="text-2xl font-bold">৳{stats.totalRevenue}</p></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow mt-4 h-72">
            <h3 className="font-bold mb-2">Monthly Bookings</h3>
            <ResponsiveContainer width="100%" height="90%"><BarChart data={stats.monthly}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="bookings" fill="#059669" /></BarChart></ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="overflow-x-auto mt-5 bg-white rounded-2xl shadow">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="p-3 text-left">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Date</th><th className="p-3">Change Role</th></tr></thead>
            <tbody>{users.map((u) => (<tr key={u._id} className="border-t"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">{u.role}</td><td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td><td className="p-3"><select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className="border p-1 rounded"><option value="customer">customer</option><option value="owner">owner</option><option value="admin">admin</option></select></td></tr>))}</tbody></table>
        </div>
      )}

      {tab === "eq" && (
        <div className="overflow-x-auto mt-5 bg-white rounded-2xl shadow">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="p-3 text-left">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Qty</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
            <tbody>{equipments.map((it) => (<tr key={it._id} className="border-t"><td className="p-3">{it.name}</td><td className="p-3">{it.category}</td><td className="p-3">৳{it.rentalPrice}</td><td className="p-3">{it.availableQuantity}</td><td className="p-3">{it.status}</td><td className="p-3 flex gap-2"><button onClick={() => changeStatus(it._id, "Approved")} className="text-emerald-600">Approve</button><button onClick={() => changeStatus(it._id, "Rejected")} className="text-orange-500">Reject</button><button onClick={() => delEq(it._id)} className="text-red-500">Delete</button></td></tr>))}</tbody></table>
        </div>
      )}

      {tab === "rentals" && (
        <div className="overflow-x-auto mt-5 bg-white rounded-2xl shadow">
          <table className="w-full text-sm"><thead><tr className="bg-gray-50"><th className="p-3 text-left">Customer</th><th className="p-3">Owner</th><th className="p-3">Equipment</th><th className="p-3">Duration</th><th className="p-3">Amount</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr></thead>
            <tbody>{rentals.map((b) => (<tr key={b._id} className="border-t"><td className="p-3">{b.customer?.name}</td><td className="p-3">{b.owner?.name}</td><td className="p-3">{b.equipment?.name}</td><td className="p-3">{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</td><td className="p-3">৳{b.totalAmount}</td><td className="p-3">{b.paymentStatus}</td><td className="p-3">{b.bookingStatus}</td></tr>))}</tbody></table>
        </div>
      )}

      {tab === "profile" && (
        <form onSubmit={saveProfile} className="bg-white p-5 rounded-2xl shadow mt-5 max-w-md space-y-3">
          <p><b>Email:</b> {user?.email} | <b>Role:</b> {user?.role}</p>
          <input className="w-full border p-2 rounded" placeholder="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          <input className="w-full border p-2 rounded" placeholder="Photo Link" value={profile.photo} onChange={(e) => setProfile({ ...profile, photo: e.target.value })} />
          <input className="w-full border p-2 rounded" placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          <input className="w-full border p-2 rounded" placeholder="Address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
          <button className="bg-emerald-600 text-white px-6 py-2 rounded-full">Save Profile</button>
        </form>
      )}
    </div>
  );
}
