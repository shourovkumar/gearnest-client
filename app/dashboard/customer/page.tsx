// customer dashboard - rentals + favorites + profile
"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function StatusBadge({ value, type }: { value: string; type: "payment" | "booking" }) {
  const v = (value || "-").toLowerCase();
  let cls = "bg-slate-100 text-slate-700";
  if (type === "payment") {
    if (v === "paid") cls = "bg-emerald-50 text-emerald-700";
    else if (v === "pending") cls = "bg-amber-50 text-amber-700";
    else if (v === "failed") cls = "bg-red-50 text-red-600";
  } else {
    if (v === "confirmed") cls = "bg-emerald-50 text-emerald-700";
    else if (v === "pending") cls = "bg-amber-50 text-amber-700";
    else if (v === "cancelled" || v === "canceled") cls = "bg-red-50 text-red-600";
    else if (v === "completed") cls = "bg-blue-50 text-blue-700";
  }
  return <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full capitalize ${cls}`}>{value || "-"}</span>;
}

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
    fetch(`${API}/reviews/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setMyReviews(d.reviews || d || [])).catch(() => setMyReviews([]));
    if (user) setProfile({ name: user.name || "", photo: (user as any).photo || "", phone: (user as any).phone || "", address: (user as any).address || "" });
  }, [token, user]);

  const totalSpent = useMemo(() => bookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0), [bookings]);

  const removeFav = async (eqId: string) => {
    await fetch(`${API}/favorites/${eqId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setFavs(favs.filter((f) => f.equipment._id !== eqId));
    toast.success("Removed from favorites");
  };

  const saveProfile = async (e: any) => {
    e.preventDefault();
    await fetch(`${API}/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(profile) });
    toast.success("Profile updated");
  };

  // Profile completeness
  const filled = [profile.name, profile.photo, profile.phone, profile.address].filter((x) => x).length;
  const percent = Math.round((filled / 4) * 100);

  const tabs = [
    { key: "rentals", label: `My Rentals (${bookings.length})` },
    { key: "favs", label: `Favorites (${favs.length})` },
    { key: "reviews", label: `My Reviews (${myReviews.length})` },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Customer Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, <span className="font-semibold text-slate-900">{user?.name || "Customer"}</span> - manage your rentals, favorites and profile.</p>
        </div>
        <Link href="/equipment" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition text-center">Browse Equipment →</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
        <div className="bg-white rounded-2xl border p-4"><p className="text-xs text-slate-500">Total Rentals</p><p className="text-2xl font-extrabold mt-1">{bookings.length}</p><p className="text-xs text-slate-400 mt-1">All bookings</p></div>
        <div className="bg-white rounded-2xl border p-4"><p className="text-xs text-slate-500">Total Spent</p><p className="text-2xl font-extrabold mt-1">৳{totalSpent.toLocaleString()}</p><p className="text-xs text-slate-400 mt-1">Across all rentals</p></div>
        <div className="bg-white rounded-2xl border p-4"><p className="text-xs text-slate-500">Favorites</p><p className="text-2xl font-extrabold mt-1">{favs.length}</p><p className="text-xs text-slate-400 mt-1">Saved equipments</p></div>
        <div className="bg-white rounded-2xl border p-4"><p className="text-xs text-slate-500">My Reviews</p><p className="text-2xl font-extrabold mt-1">{myReviews.length}</p><p className="text-xs text-slate-400 mt-1">Reviews you wrote</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-6 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2.5 rounded-full text-sm font-semibold transition ${tab === t.key ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "rentals" && (
        <div className="mt-5">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-left"><th className="p-4 font-semibold">Equipment</th><th className="p-4">Start</th><th className="p-4">End</th><th className="p-4">Booking Date</th><th className="p-4">Total</th><th className="p-4">Payment</th><th className="p-4">Status</th></tr></thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t hover:bg-slate-50/50">
                    <td className="p-4"><Link href={`/equipment/${b.equipment?._id}`} className="font-semibold text-slate-900 hover:text-emerald-700">{b.equipment?.name || "Equipment"}</Link><p className="text-xs text-slate-500">{b.equipment?.category || ""} - Qty {b.quantity || 1}</p></td>
                    <td className="p-4 whitespace-nowrap">{new Date(b.startDate).toLocaleDateString()}</td>
                    <td className="p-4 whitespace-nowrap">{new Date(b.endDate).toLocaleDateString()}</td>
                    <td className="p-4 whitespace-nowrap">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold">৳{Number(b.totalAmount || 0).toLocaleString()}</td>
                    <td className="p-4"><StatusBadge value={b.paymentStatus} type="payment" /></td>
                    <td className="p-4"><StatusBadge value={b.bookingStatus} type="booking" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <p className="p-8 text-center text-slate-500">No rentals yet. <Link href="/equipment" className="text-emerald-600 font-semibold">Browse equipment</Link> to make your first booking.</p>}
          </div>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl border p-4">
                <div className="flex justify-between gap-3"><Link href={`/equipment/${b.equipment?._id}`} className="font-bold text-slate-900">{b.equipment?.name || "Equipment"}</Link><span className="font-bold">৳{Number(b.totalAmount || 0).toLocaleString()}</span></div>
                <p className="text-xs text-slate-500 mt-1">{new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()} - Qty {b.quantity || 1}</p>
                <div className="flex gap-2 mt-3"><StatusBadge value={b.paymentStatus} type="payment" /><StatusBadge value={b.bookingStatus} type="booking" /></div>
                <p className="text-xs text-slate-400 mt-2">Booked on {new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {bookings.length === 0 && <p className="bg-white p-6 rounded-2xl text-center text-slate-500 border">No rentals yet. <Link href="/equipment" className="text-emerald-600 font-semibold">Browse equipment</Link></p>}
          </div>
        </div>
      )}

      {tab === "favs" && (
        <div className="mt-5">
          {favs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favs.map((f) => (
                <div key={f._id} className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition">
                  <img src={f.equipment?.image || "https://via.placeholder.com/600x400?text=GearNest"} alt={f.equipment?.name} className="w-full h-44 object-cover" />
                  <div className="p-4">
                    <p className="font-bold text-slate-900 truncate">{f.equipment?.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{f.equipment?.category} - {f.equipment?.location}</p>
                    <p className="text-emerald-600 font-bold mt-2">৳{Number(f.equipment?.rentalPrice || f.equipment?.pricePerDay || 0).toLocaleString()} / {f.equipment?.rentalType || "Daily"}</p>
                    <div className="flex gap-2 mt-3"><Link href={`/equipment/${f.equipment?._id}`} className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 rounded-full">View Details</Link><button onClick={() => removeFav(f.equipment._id)} className="px-4 border border-red-200 text-red-600 text-sm font-semibold py-2 rounded-full">Remove</button></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="bg-white p-8 rounded-2xl text-center text-slate-500 border">No favorites yet. Tap the heart on any equipment details page to save it here.</p>
          )}
        </div>
      )}

      {tab === "reviews" && (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {myReviews.map((r: any) => (
            <div key={r._id} className="bg-white p-4 rounded-2xl shadow-sm border">
              <div className="flex justify-between gap-2"><p className="font-bold text-slate-900">{r.equipment?.name || "Equipment"}</p><span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">⭐ {r.rating}/5</span></div>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">{r.comment}</p>
              <p className="text-xs text-slate-400 mt-2">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</p>
            </div>
          ))}
          {myReviews.length === 0 && <p className="md:col-span-2 bg-white p-8 rounded-2xl text-center text-slate-500 border">No reviews yet - write a review from any equipment details page.</p>}
        </div>
      )}

      {tab === "profile" && (
        <form onSubmit={saveProfile} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border mt-5 max-w-lg space-y-3">
          <div className="flex items-center gap-3">
            {profile.photo ? <img src={profile.photo} alt="Profile" className="w-14 h-14 rounded-full object-cover" /> : <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xl">{(profile.name || user?.name || "G")[0].toUpperCase()}</div>}
            <div><p className="font-bold text-slate-900">{profile.name || user?.name}</p><p className="text-sm text-slate-500">{user?.email}</p><p className="text-xs text-slate-400 capitalize">{user?.role}</p></div>
          </div>
          <div>
            <p className="text-sm font-medium">Profile Completeness: {percent}%</p>
            <div className="w-full bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden"><div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${percent}%` }}></div></div>
            {percent < 100 && <p className="text-xs text-amber-600 mt-1.5">Add phone, photo and address to reach 100%.</p>}
          </div>
          <div><label className="text-sm font-medium">Full Name</label><input className="w-full border p-2.5 rounded-lg mt-1" placeholder="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Photo URL</label><input className="w-full border p-2.5 rounded-lg mt-1" placeholder="https://..." value={profile.photo} onChange={(e) => setProfile({ ...profile, photo: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Phone</label><input className="w-full border p-2.5 rounded-lg mt-1" placeholder="Phone number" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Address</label><input className="w-full border p-2.5 rounded-lg mt-1" placeholder="Full address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-semibold w-full sm:w-auto">Save Profile</button>
        </form>
      )}
    </div>
  );
}
