// ekta equipment er details + booking + review + favorite
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function DetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState("2026-11-25");
  const [endDate, setEndDate] = useState("2026-11-27");
  const [msg, setMsg] = useState("");
  const [isFav, setIsFav] = useState(false);
  const { token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API}/equipment/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data.equipment));
    fetch(`${API}/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []));
    const favs = JSON.parse(localStorage.getItem("favs") || "[]");
    setIsFav(favs.includes(id));
  }, [id]);

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem("favs") || "[]");
    let newFavs = [];
    if (isFav) {
      newFavs = favs.filter((f: string) => f !== id);
    } else {
      newFavs = [...favs, id];
    }
    localStorage.setItem("favs", JSON.stringify(newFavs));
    setIsFav(!isFav);
  };

  const handleBooking = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (user?.role !== "customer") {
      setMsg("Only customer can book. Login as customer.");
      return;
    }
    const res = await fetch(`${API}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ equipmentId: id, startDate, endDate }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message);
      return;
    }
    setMsg(`Booking success! Total: ৳${data.booking.totalPrice} for ${data.booking.totalDays} days`);
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
          <p className="text-emerald-600 font-bold text-2xl mt-3">৳{item.pricePerDay} / day</p>
          <button onClick={toggleFav} className="mt-3 border px-3 py-1 rounded">
            {isFav ? "❤️ Favorited" : "🤍 Add to Favorite"}
          </button>
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
