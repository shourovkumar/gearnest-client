// Details page - equipment details + booking + review + favorite
"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Past date block - today
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  // Booking modal fields - same as old code
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [quantity, setQuantity] = useState(1);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const { token, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // FIX: Kotha theke login a gelam mone rakha - returnUrl
  const goLogin = () => {
    const backTo = pathname || `/equipment/${id}`;
    router.push(`/login?returnUrl=${encodeURIComponent(backTo)}`);
  };

  useEffect(() => {
    fetch(`${API}/equipment/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.equipment));
    fetch(`${API}/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []));
    // Favorite check from DB
    if (token) {
      fetch(`${API}/favorites/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setIsFav(data.isFavorite));
    }
  }, [id, token]);

  const price = useMemo(() => Number(item?.rentalPrice || item?.pricePerDay || 0), [item]);
  const availableQty = useMemo(() => Number(item?.availableQuantity ?? item?.quantity ?? 1), [item]);
  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((a, r) => a + Number(r.rating || 0), 0);
    return sum / reviews.length;
  }, [reviews]);
  const totalDays = useMemo(() => {
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    if (isNaN(s) || isNaN(e) || e <= s) return 1;
    return Math.ceil((e - s) / 86400000) + 1;
  }, [startDate, endDate]);
  const estimatedTotal = price * totalDays * quantity;

  const toggleFav = async () => {
    if (!token) {
      goLogin();
      return;
    }
    if (isFav) {
      await fetch(`${API}/favorites/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFav(false);
      toast.success("Removed from favorites");
    } else {
      await fetch(`${API}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ equipmentId: id }),
      });
      setIsFav(true);
      toast.success("Added to favorites");
    }
  };

  const handleBooking = async (e: any) => {
    e.preventDefault();
    if (!token) {
      setShowModal(false);
      goLogin();
      return;
    }
    if (user?.role !== "customer") {
      setMsg("Only customers can book. Please login as a customer.");
      toast.error("Only customers can book");
      return;
    }
    // Date check - past date and end <= start not allowed
    if (new Date(startDate) < new Date(today)) {
      toast.error("Past dates cannot be booked");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End date must be after start date");
      return;
    }
    // Backend - checkout + Stripe
    const res = await fetch(`${API}/bookings/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ equipmentId: id, startDate, endDate, quantity, contact, address, notes }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message);
      toast.error(data.message || "Booking failed");
      return;
    }
    // Stripe URL -> Stripe, else direct success page
    if (data.url && data.url.startsWith("http")) {
      window.location.href = data.url;
    } else {
      router.push(data.url);
    }
  };

  const handleReview = async () => {
    if (!token) {
      goLogin();
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write your review");
      return;
    }
    const res = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ equipmentId: id, rating, comment }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message);
      toast.error(data.message || "Failed to add review");
      return;
    }
    setMsg("Review added!");
    toast.success("Review added!");
    setComment("");
    window.location.reload();
  };

  if (!item) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        </div>
        <p className="text-center text-slate-500 mt-6 text-sm">Loading equipment details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => router.back()} className="hover:text-slate-900">Back</button>
        <span>/</span>
        <a href="/equipment" className="hover:text-slate-900">All Equipment</a>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{item.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-10 mt-5">
        {/* Image */}
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
            <img
              src={item.image || "https://via.placeholder.com/800x560?text=GearNest"}
              alt={item.name}
              className="w-full h- sm:h- lg:h- object-cover"
            />
            <span className="absolute top-4 left-4 bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow">{item.category}</span>
            <button
              onClick={toggleFav}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-lg hover:scale-105 transition"
              aria-label="Favorite"
            >
              {isFav ? "❤" : "♡"}
            </button>
            <span className={`absolute bottom-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${availableQty > 0 ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
              {availableQty > 0 ? `Available - ${availableQty} pcs` : "Out of Stock"}
            </span>
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white rounded-xl border p-3 text-center">
              <p className="text-xs text-slate-500">Rating</p>
              <p className="font-bold mt-0.5">⭐ {avgRating ? avgRating.toFixed(1) : "New"} <span className="text-xs font-normal text-slate-500">({reviews.length})</span></p>
            </div>
            <div className="bg-white rounded-xl border p-3 text-center">
              <p className="text-xs text-slate-500">Condition</p>
              <p className="font-bold mt-0.5">{item.condition || "Good"}</p>
            </div>
            <div className="bg-white rounded-xl border p-3 text-center">
              <p className="text-xs text-slate-500">Rental Type</p>
              <p className="font-bold mt-0.5">{item.rentalType || "Daily"}</p>
            </div>
          </div>
        </div>

        {/* Details + Booking card */}
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">{item.name}</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base">{item.category} - {item.location}</p>

          <div className="flex items-baseline gap-2 mt-4">
            <p className="text-emerald-600 font-extrabold text-3xl">৳{price.toLocaleString()}</p>
            <p className="text-slate-500 text-sm">/ {item.rentalType || "Daily"}</p>
            <span className="ml-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Secure Payment via Stripe</span>
          </div>

          <p className="text-slate-600 leading-relaxed mt-4 text-">{item.description}</p>

          <div className="bg-white rounded-2xl border p-4 sm:p-5 mt-5">
            <h3 className="font-bold text-slate-900">Specifications</h3>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div><p className="text-slate-500 text-xs">Brand</p><p className="font-semibold">{item.brand || "-"}</p></div>
              <div><p className="text-slate-500 text-xs">Model</p><p className="font-semibold">{item.model || "-"}</p></div>
              <div><p className="text-slate-500 text-xs">Available Quantity</p><p className="font-semibold">{availableQty} pcs</p></div>
              <div><p className="text-slate-500 text-xs">Condition</p><p className="font-semibold">{item.condition || "Good"}</p></div>
            </div>
            <div className="border-t mt-4 pt-4 space-y-2 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Owner:</span> {item.owner?.name || "-"} {item.owner?.email ? `- ${item.owner.email}` : ""}</p>
              <p><span className="font-semibold text-slate-900">Terms:</span> {item.terms || "Handle with care. Late return charge applies."}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              onClick={() => {
                if (!token) {
                  goLogin();
                  return;
                }
                setShowModal(true);
              }}
              disabled={availableQty <= 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3.5 rounded-full transition shadow-sm"
            >
              {availableQty > 0 ? "Book Now - Pay Securely" : "Out of Stock"}
            </button>
            <button onClick={toggleFav} className="border border-slate-200 bg-white hover:border-emerald-600 hover:text-emerald-700 font-semibold px-6 py-3.5 rounded-full transition">
              {isFav ? "❤ Favorited" : "♡ Add to Favorite"}
            </button>
          </div>
          {msg && <p className="text-sm text-emerald-600 mt-3 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">{msg}</p>}
          <p className="text-xs text-slate-500 mt-3">Free cancellation before start date. You will be redirected to secure Stripe checkout after confirming.</p>
        </div>
      </div>

      {/* Booking modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <form onSubmit={handleBooking} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-lg space-y-3 max-h- overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Book Equipment</h2>
                <p className="text-sm text-slate-500 mt-0.5">{item.name} - ৳{price.toLocaleString()} / {item.rentalType || "Daily"}</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">✕</button>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-sm flex justify-between">
              <span className="text-slate-600">{totalDays} day(s) x {quantity} pcs x ৳{price.toLocaleString()}</span>
              <span className="font-bold text-slate-900">Est. ৳{estimatedTotal.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input required type="date" min={today} className="w-full border p-2.5 rounded-lg mt-1" value={startDate} onChange={(e) => { setStartDate(e.target.value); if (endDate <= e.target.value) setEndDate(e.target.value); }} />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <input required type="date" min={startDate || today} className="w-full border p-2.5 rounded-lg mt-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Quantity (Max {availableQty})</label>
              <input required type="number" min={1} max={availableQty} className="w-full border p-2.5 rounded-lg mt-1" value={quantity} onChange={(e) => setQuantity(Math.min(availableQty, Math.max(1, Number(e.target.value) || 1)))} />
            </div>
            <div>
              <label className="text-sm font-medium">Contact Number</label>
              <input required className="w-full border p-2.5 rounded-lg mt-1" placeholder="e.g. 01700-000000" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Delivery Address</label>
              <input required className="w-full border p-2.5 rounded-lg mt-1" placeholder="Full delivery address in Dhaka" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Additional Notes (Optional)</label>
              <textarea className="w-full border p-2.5 rounded-lg mt-1" rows={2} placeholder="Any special instructions..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="flex gap-2 pt-1">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-semibold">Confirm & Pay - ৳{estimatedTotal.toLocaleString()}</button>
              <button type="button" onClick={() => setShowModal(false)} className="px-5 border py-3 rounded-full font-semibold">Cancel</button>
            </div>
            <p className="text-xs text-slate-500 text-center">Past dates are blocked. End date must be after start date.</p>
          </form>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-10 md:mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900">Reviews <span className="text-slate-400 text-lg font-medium">({reviews.length})</span></h2>
          <p className="text-sm text-slate-500">Average: ⭐ {avgRating ? avgRating.toFixed(1) : "No ratings yet"} / 5</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border mt-4 flex flex-col gap-3 max-w-2xl">
          <label className="text-sm font-medium">Your Rating</label>
          <select className="border p-2.5 rounded-lg" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={5}>5 - Excellent</option><option value={4}>4 - Good</option><option value={3}>3 - Average</option><option value={2}>2 - Poor</option><option value={1}>1 - Very Poor</option>
          </select>
          <label className="text-sm font-medium">Your Review</label>
          <textarea className="border p-2.5 rounded-lg" rows={3} placeholder="Share your experience with this equipment..." value={comment} onChange={(e) => setComment(e.target.value)} />
          <button onClick={handleReview} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-full font-semibold">Add Review</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {reviews.map((r) => (
            <div key={r._id} className="bg-white p-4 rounded-2xl shadow-sm border">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900">{r.user?.name || "Customer"}</p>
                <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">⭐ {r.rating}/5</span>
              </div>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{r.comment}</p>
              <p className="text-xs text-slate-400 mt-2">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</p>
            </div>
          ))}
        </div>
        {reviews.length === 0 && <p className="text-center text-slate-500 bg-white border rounded-2xl py-8 mt-4">No reviews yet. Be the first to review this equipment.</p>}
      </div>
    </div>
  );
}
