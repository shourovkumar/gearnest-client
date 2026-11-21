// ekta equipment er details + booking + review + favorite
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  // past date block - ajker date
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  // booking modal er field - video er moto
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [quantity, setQuantity] = useState(1);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const { token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API}/equipment/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.equipment));
    fetch(`${API}/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []));
    // favorite ekhon DB theke check korbo
    if (token) {
      fetch(`${API}/favorites/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setIsFav(data.isFavorite));
    }
  }, [id, token]);

  const toggleFav = async () => {
    if (!token) {
      router.push("/login");
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
      router.push("/login");
      return;
    }
    if (user?.role !== "customer") {
      setMsg("Only customer can book. Login as customer.");
      toast.error("Only customer can book");
      return;
    }
    // date check - past date ar end < start hobe na
    if (new Date(startDate) < new Date(today)) {
      toast.error("Past date diye booking hobe na");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("End Date Start Date er pore hote hobe");
      return;
    }
    // notun backend - checkout + stripe
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
    // stripe url hole stripe a jabe, na hole direct success page
    if (data.url && data.url.startsWith("http")) {
      window.location.href = data.url;
    } else {
      router.push(data.url);
    }
  };

  const handleReview = async () => {
    if (!token) {
      router.push("/login");
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
      return;
    }
    setMsg("Review added!");
    toast.success("Review added!");
    setComment("");
    window.location.reload();
  };

  if (!item) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img src={item.image || "https://via.placeholder.com/600x400?text=GearNest"} alt={item.name} className="w-full h-80 object-cover rounded" />
        <div>
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <p className="text-gray-500 mt-1">{item.category} - {item.location}</p>
          <p className="mt-3">{item.description}</p>
          <p className="text-emerald-600 font-bold text-2xl mt-3">৳{item.rentalPrice || item.pricePerDay} / {item.rentalType || "Daily"}</p>
          <div className="mt-3 text-sm space-y-1">
            <p><b>Available:</b> {item.availableQuantity ?? item.quantity ?? 1} pcs</p>
            <p><b>Brand:</b> {item.brand || "-"} | <b>Model:</b> {item.model || "-"} | <b>Condition:</b> {item.condition || "Good"}</p>
            <p><b>Owner:</b> {item.owner?.name || "-"} - {item.owner?.email || ""}</p>
            <p><b>Terms:</b> {item.terms || "Handle with care. Late return charge applies."}</p>
          </div>
          <button onClick={toggleFav} className="mt-3 border px-3 py-1 rounded">
            {isFav ? "❤ Favorited" : "🤍 Add to Favorite"}
          </button>
          <div className="mt-4">
            <button onClick={() => setShowModal(true)} className="bg-emerald-600 text-white px-6 py-2 rounded">Book Now</button>
            {msg && <p className="text-sm text-emerald-600 mt-2">{msg}</p>}
          </div>
        </div>
      </div>

      {/* booking modal - video er moto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleBooking} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
            <h2 className="text-xl font-bold">Book Equipment</h2>
            <label className="text-sm">Start Date</label>
            <input required type="date" min={today} className="w-full border p-2 rounded" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label className="text-sm">End Date</label>
            <input required type="date" min={startDate || today} className="w-full border p-2 rounded" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <label className="text-sm">Quantity</label>
            <input required type="number" min={1} className="w-full border p-2 rounded" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <input required className="w-full border p-2 rounded" placeholder="Contact Number" value={contact} onChange={(e) => setContact(e.target.value)} />
            <input required className="w-full border p-2 rounded" placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <textarea className="w-full border p-2 rounded" placeholder="Additional Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex gap-2">
              <button className="flex-1 bg-emerald-600 text-white py-2 rounded">Confirm & Pay</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 border py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Reviews - {reviews.length} ta</h2>
        <div className="bg-white p-4 rounded shadow mt-3 flex flex-col gap-2 max-w-xl">
          <select className="border p-2 rounded" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={5}>5 - Excellent</option><option value={4}>4 - Good</option><option value={3}>3 - Average</option><option value={2}>2 - Bad</option><option value={1}>1 - Poor</option>
          </select>
          <input className="border p-2 rounded" placeholder="Your review..." value={comment} onChange={(e) => setComment(e.target.value)} />
          <button onClick={handleReview} className="bg-emerald-600 text-white py-2 rounded">Add Review</button>
        </div>
        {reviews.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded shadow mt-2">
            <p className="font-bold">{r.user?.name} - ⭐ {r.rating}/5</p>
            <p className="text-sm">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
