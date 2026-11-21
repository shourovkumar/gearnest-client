// customer dashboard - rentals + favorites + profile
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function CustomerDashboard() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState("rentals");
  const [bookings, setBookings] = useState<any[]>([]);
  const [favs, setFavs] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [profile, setProfile] = useState({ name: "", photo: "", phone: "", address: "" });

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setBookings(d.bookings || []));
    fetch(`${API}/favorites/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setFavs(d.favorites || []));
    // my reviews - jodi server a route na thake, empty dekhabe
    fetch(`${API}/reviews/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setMyReviews(d.reviews || d || [])).catch(() => setMyReviews([]));
    if (user) setProfile({ name: user.name || "", photo: (user as any).photo || "", phone: (user as any).phone || "", address: (user as any).address || "" });
  }, [token, user]);

  const removeFav = async (eqId: string) => {
    await fetch(`${API}/favorites/${eqId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setFavs(favs.filter((f) => f.equipment._id !== eqId));
    toast.success("Removed");
  };

  const saveProfile = async (e: any) => {
    e.preventDefault();
    await fetch(`${API}/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(profile) });
    toast.success("Profile updated");
  };

  // profile completeness - koto % fill hoise
  const filled = [profile.name, profile.photo, profile.phone, profile.address].filter((x) => x).length;
  const percent = Math.round((filled / 4) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Customer Dashboard</h1>
      <p className="text-gray-500">Welcome, {user?.name}</p>
      <div className="flex gap-2 mt-5 flex-wrap">
        <button onClick={() => setTab("rentals")} className={`px-4 py-2 rounded-full ${tab === "rentals" ? "bg-emerald-600 text-white" : "border"}`}>My Rentals</button>
        <button onClick={() => setTab("favs")} className={`px-4 py-2 rounded-full ${tab === "favs" ? "bg-emerald-600 text-white" : "border"}`}>Favorites</button>
        <button onClick={() => setTab("reviews")} className={`px-4 py-2 rounded-full ${tab === "reviews" ? "bg-emerald-600 text-white" : "border"}`}>My Reviews</button>
        <button onClick={() => setTab("profile")} className={`px-4 py-2 rounded-full ${tab === "profile" ? "bg-emerald-600 text-white" : "border"}`}>Profile</button>
      </div>

      {tab === "rentals" && (
        <div className="overflow-x-auto mt-5 bg-white rounded-2xl shadow">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50"><th className="p-3 text-left">Equipment</th><th className="p-3">Start</th><th className="p-3">End</th><th className="p-3">Booking Date</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t"><td className="p-3">{b.equipment?.name}</td><td className="p-3">{new Date(b.startDate).toLocaleDateString()}</td><td className="p-3">{new Date(b.endDate).toLocaleDateString()}</td><td className="p-3">{new Date(b.createdAt).toLocaleDateString()}</td><td className="p-3">৳{b.totalAmount}</td><td className="p-3">{b.paymentStatus}</td><td className="p-3">{b.bookingStatus}</td></tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="p-4 text-center text-gray-500">No rentals yet</p>}
        </div>
      )}

      {tab === "favs" && (
        <div className="overflow-x-auto mt-5 bg-white rounded-2xl shadow">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50"><th className="p-3 text-left">Equipment</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Action</th></tr></thead>
            <tbody>
              {favs.map((f) => (
                <tr key={f._id} className="border-t"><td className="p-3">{f.equipment?.name}</td><td className="p-3">{f.equipment?.category}</td><td className="p-3">৳{f.equipment?.rentalPrice}</td><td className="p-3 flex gap-2"><Link href={`/equipment/${f.equipment?._id}`} className="text-emerald-600">View</Link><button onClick={() => removeFav(f.equipment._id)} className="text-red-500">Remove</button></td></tr>
              ))}
            </tbody>
          </table>
          {favs.length === 0 && <p className="p-4 text-center text-gray-500">No favorites yet</p>}
        </div>
      )}

      {tab === "reviews" && (
        <div className="mt-5 space-y-3">
          {myReviews.map((r: any) => (
            <div key={r._id} className="bg-white p-4 rounded-2xl shadow">
              <p className="font-bold">{r.equipment?.name || "Equipment"} - ⭐ {r.rating}/5</p>
              <p className="text-gray-600">{r.comment}</p>
              <p className="text-xs text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</p>
            </div>
          ))}
          {myReviews.length === 0 && <p className="bg-white p-4 rounded-2xl text-center text-gray-500">No reviews yet - Details page theke review dao</p>}
        </div>
      )}

      {tab === "profile" && (
        <form onSubmit={saveProfile} className="bg-white p-5 rounded-2xl shadow mt-5 max-w-md space-y-3">
          <p><b>Email:</b> {user?.email}</p>
          <div>
            <p className="text-sm">Profile Completeness: {percent}%</p>
            <div className="w-full bg-gray-200 h-2 rounded-full"><div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${percent}%` }}></div></div>
            {percent < 100 && <p className="text-xs text-orange-500 mt-1">Phone / Photo / Address baki ache - fill korle 100% hobe</p>}
          </div>
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
