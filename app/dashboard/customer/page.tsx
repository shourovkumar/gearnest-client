// customer dashboard - rentals + favorites + profile
"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [cancelId, setCancelId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);

  // FINAL: Merge korbe - khali field diye ager ta muchbe na + photoURL o dekhbe
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setBookings(d.bookings || []));
    fetch(`${API}/favorites/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setFavs(d.favorites || []));
    fetch(`${API}/reviews/my`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then((d) => setMyReviews(d.reviews || d || [])).catch(() => setMyReviews([]));

    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const u = d.user || d;
        if (!u || !u.name) {
          if (user) setProfile({ name: user.name || "", photo: (user as any).photo || (user as any).photoURL || "", phone: (user as any).phone || "", address: (user as any).address || "" });
          return;
        }
        setProfile((prev) => ({
          name: u.name || prev.name || user?.name || "",
          photo: u.photo || u.photoURL || prev.photo || (user as any)?.photo || (user as any)?.photoURL || "",
          phone: u.phone || prev.phone || (user as any)?.phone || "",
          address: u.address || prev.address || (user as any)?.address || "",
        }));
      })
      .catch(() => {
        if (user) setProfile({ name: user.name || "", photo: (user as any).photo || (user as any).photoURL || "", phone: (user as any).phone || "", address: (user as any).address || "" });
      });
  }, [token]);

  const totalSpent = useMemo(() => bookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0), [bookings]);

  const removeFav = async (eqId: string) => {
    await fetch(`${API}/favorites/${eqId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setFavs(favs.filter((f) => f.equipment._id !== eqId));
    toast.success("Removed from favorites");
  };

  const cancelBooking = async () => {
    if (!cancelId) return;
    const res = await fetch(`${API}/bookings/${cancelId}/cancel`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return toast.error("Cancel failed");
    toast.success("Booking cancelled");
    setBookings(bookings.map((b) => (b._id === cancelId ? { ...b, bookingStatus: "Cancelled" } : b)));
    setCancelId(null);
  };

  const handlePhotoSelect = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }
    const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";
    if (!IMGBB_KEY) {
      toast.error("ImgBB key nai - .env.local a key dao, tarpor npm run dev restart dao");
      return;
    }
    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error("Upload failed");
      setProfile((prev) => ({ ...prev, photo: data.data.url }));
      toast.success("Photo uploaded! Click Save Profile to save it.");
    } catch {
      toast.error("ImgBB upload fail - key ta thik ache kina dekho");
    } finally {
      setPhotoUploading(false);
    }
    e.target.value = "";
  };

  const removePhoto = () => {
    setProfile((prev) => ({ ...prev, photo: "" }));
    toast.success('Photo removed! Click Save Profile to save it.');
  };

  const saveProfile = async (e: any) => {
    e.preventDefault();
    let photoToSend = profile.photo;
    if (photoToSend && photoToSend.startsWith("data:image")) {
      toast.error("Puran boro photo ta baad dilam - ImgBB diye notun kore upload koro");
      photoToSend = "";
    }
    const res = await fetch(`${API}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...profile, photo: photoToSend, photoURL: photoToSend }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(data.message || "Profile update failed");

    const updated = data.user || { ...profile, photo: photoToSend };
    const finalPhoto = updated.photo || updated.photoURL || photoToSend;
    setProfile({ name: updated.name || "", photo: finalPhoto || "", phone: updated.phone || "", address: updated.address || "" });

    try {
      ["user", "gearnest_user", "auth_user"].forEach((key) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          const old = JSON.parse(stored);
          localStorage.setItem(key, JSON.stringify({ ...old, name: updated.name, photo: finalPhoto, photoURL: finalPhoto, phone: updated.phone, address: updated.address }));
        }
      });
    } catch {}

    toast.success("Profile updated");
    if (!photoToSend) setProfile((prev) => ({ ...prev, photo: "" }));
  };

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
        <div className="bg-white rounded-2xl border p-4"><p className="text-xs text-slate-500">Total Rentals</p><p className="text-2xl font-extrabold mt-1">{bookings.length}</p><p className="text-xs text-slate-400 mt-1">All bookings</p></div>
        <div className="bg-white rounded-2xl border p-4"><p className="text-xs text-slate-500">Total Spent</p><p className="text-2xl font-extrabold mt-1">৳{totalSpent.toLocaleString()}</p><p className="text-xs text-slate-400 mt-1">Across all rentals</p></div>
        <div className="bg-white rounded-2xl border p-4"><p className="text-xs text-slate-500">Favorites</p><p className="text-2xl font-extrabold mt-1">{favs.length}</p><p className="text-xs text-slate-400 mt-1">Saved equipments</p></div>
        <div className="bg-white rounded-2xl border p-4"><p className="text-xs text-slate-500">My Reviews</p><p className="text-2xl font-extrabold mt-1">{myReviews.length}</p><p className="text-xs text-slate-400 mt-1">Reviews you wrote</p></div>
      </div>

      <div className="flex gap-2 mt-6 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2.5 rounded-full text-sm font-semibold transition ${tab === t.key ? "bg-emerald-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "rentals" && (
        <div className="mt-5">
          <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-left"><th className="p-4 font-semibold">Equipment</th><th className="p-4">Start</th><th className="p-4">End</th><th className="p-4">Booking Date</th><th className="p-4">Total</th><th className="p-4">Payment</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead>
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
                    <td className="p-4">
                      {(b.bookingStatus === "Pending" || b.bookingStatus === "Confirmed") && (
                        <button onClick={() => setCancelId(b._id)} className="text-red-600 font-semibold text-xs border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && <p className="p-8 text-center text-slate-500">No rentals yet. <Link href="/equipment" className="text-emerald-600 font-semibold">Browse equipment</Link> to make your first booking.</p>}
          </div>
          <div className="md:hidden space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl border p-4">
                <div className="flex justify-between gap-3"><Link href={`/equipment/${b.equipment?._id}`} className="font-bold text-slate-900">{b.equipment?.name || "Equipment"}</Link><span className="font-bold">৳{Number(b.totalAmount || 0).toLocaleString()}</span></div>
                <p className="text-xs text-slate-500 mt-1">{new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()} - Qty {b.quantity || 1}</p>
                <div className="flex gap-2 mt-3"><StatusBadge value={b.paymentStatus} type="payment" /><StatusBadge value={b.bookingStatus} type="booking" /></div>
                <p className="text-xs text-slate-400 mt-2">Booked on {new Date(b.createdAt).toLocaleDateString()}</p>
                {(b.bookingStatus === "Pending" || b.bookingStatus === "Confirmed") && (
                  <button onClick={() => setCancelId(b._id)} className="mt-3 w-full border border-red-200 text-red-600 text-sm font-semibold py-2 rounded-full">Cancel Booking</button>
                )}
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
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <div className="relative w-32 h-32 mx-auto">
              {profile.photo ? (
                <img src={profile.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-emerald-50 shadow-sm" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-4xl border-4 border-emerald-50">{(profile.name || user?.name || "G")[0].toUpperCase()}</div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center text-base transition"
                title="Change photo"
              >
                📷
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
            </div>
            <p className="font-bold text-lg text-slate-900 mt-4 truncate">{profile.name || user?.name || "Customer"}</p>
            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
            <span className="inline-block mt-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full capitalize">{user?.role || "customer"}</span>

            <div className="text-left bg-slate-50 rounded-xl p-4 mt-5">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-slate-900">Profile Completeness</p>
                <p className="text-sm font-extrabold text-emerald-600">{percent}%</p>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full mt-2 overflow-hidden"><div className="bg-emerald-600 h-2.5 rounded-full transition-all" style={{ width: `${percent}%` }}></div></div>
              <div className="mt-3 space-y-1.5 text-sm">
                <p className={profile.name ? "text-emerald-600" : "text-slate-500"}>{profile.name ? "✓" : "○"} Full Name</p>
                <p className={profile.photo ? "text-emerald-600" : "text-slate-500"}>{profile.photo ? "✓" : "○"} Profile Photo</p>
                <p className={profile.phone ? "text-emerald-600" : "text-slate-500"}>{profile.phone ? "✓" : "○"} Phone</p>
                <p className={profile.address ? "text-emerald-600" : "text-slate-500"}>{profile.address ? "✓" : "○"} Address</p>
              </div>
              {percent < 100 && <p className="text-xs text-amber-600 mt-3">Add missing info to reach 100%.</p>}
            </div>

            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full mt-4 border border-slate-200 hover:border-emerald-600 hover:text-emerald-700 text-sm font-semibold py-2.5 rounded-full transition">
              {photoUploading ? "Uploading..." : profile.photo ? "Change Photo" : "Upload Photo"}
            </button>
            {profile.photo && (
              <button type="button" onClick={removePhoto} className="w-full mt-2 text-sm font-semibold text-red-600 py-2 rounded-full hover:bg-red-50 transition">Remove Photo</button>
            )}
            <p className="text-xs text-slate-400 mt-3">JPG / PNG, max 2MB. Photo select korle Save Profile a click koro.</p>
          </div>

          <form onSubmit={saveProfile} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Profile Information</h3>
                <p className="text-sm text-slate-500">Update your personal details</p>
              </div>
              <span className="hidden sm:inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">{percent}% Complete</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Full Name</label><input className="w-full border border-slate-200 p-2.5 rounded-lg mt-1 outline-none focus:border-emerald-500" placeholder="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
              <div><label className="text-sm font-medium">Phone</label><input className="w-full border border-slate-200 p-2.5 rounded-lg mt-1 outline-none focus:border-emerald-500" placeholder="Phone number" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            </div>
            <div><label className="text-sm font-medium">Address</label><input className="w-full border border-slate-200 p-2.5 rounded-lg mt-1 outline-none focus:border-emerald-500" placeholder="Full address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></div>
            <div>
              <label className="text-sm font-medium">Photo URL <span className="text-slate-400 font-normal">(optional - link diyeo dite paro)</span></label>
              <input className="w-full border border-slate-200 p-2.5 rounded-lg mt-1 outline-none focus:border-emerald-500" placeholder="https://..." value={profile.photo} onChange={(e) => setProfile({ ...profile, photo: e.target.value })} />
              <p className="text-xs text-slate-400 mt-1.5">Upore camera button diye file upload korle ekhane auto chole asbe.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-full font-semibold transition">Save Profile</button>
              <p className="text-xs text-slate-400 self-center">Save korar por Navbar + Dashboard a notun pic dekhabe.</p>
            </div>
          </form>
        </div>
      )}

      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setCancelId(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900">Cancel Booking?</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setCancelId(null)} className="flex-1 border border-slate-200 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-50">Keep Booking</button>
              <button onClick={cancelBooking} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-full text-sm font-semibold">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
