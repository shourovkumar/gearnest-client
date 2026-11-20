// home page - banner + featured + categories + why choose + reviews + extra
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const categories = [
  { name: "Construction Equipment", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600" },
  { name: "Photography Equipment", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600" },
  { name: "Vehicles & Transportation", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600" },
  { name: "Agriculture Equipment", img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600" },
  { name: "Electronics", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600" },
  { name: "Event Equipment", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600" },
];

const reviews = [
  { name: "Rahim Uddin", rating: 5, comment: "Camera ta onek valo chilo, 1 diner jonno nisilam, delivery o fast chilo." },
  { name: "Nusrat Jahan", rating: 5, comment: "Drill machine rent korsi, price onek reasonable, owner o helpful." },
  { name: "Arif Khan", rating: 4, comment: "Car rent kora ekhon onek easy hoye gese GearNest diye." },
  { name: "Mim Akter", rating: 5, comment: "Event er jonno light + sound nisilam, sob thikthak chilo." },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API}/equipment/featured`).then((r) => r.json()).then((d) => setFeatured(d.equipments || []));
  }, []);

  const goDetails = (id: string) => {
    if (!token) router.push("/login");
    else router.push(`/equipment/${id}`);
  };

  return (
    <div>
      {/* banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative h- flex items-center">
        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600" className="absolute inset-0 w-full h-full object-cover" alt="GearNest" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold max-w-xl">Rent Any Equipment, Anytime, Anywhere</h1>
          <p className="mt-3 max-w-lg text-gray-200">Camera, Car, Machine, Drill - ja lagbe 1 din, 1 week ba 1 month er jonno rent koro, secure payment diye.</p>
          <div className="flex gap-3 mt-6">
            <Link href="/equipment"><button className="bg-emerald-600 px-6 py-2 rounded-full">Browse Equipment</button></Link>
            <Link href="/register"><button className="border border-white px-6 py-2 rounded-full">Join as Owner</button></Link>
          </div>
        </div>
      </motion.div>

      {/* featured */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center">Featured Equipment</h2>
        <p className="text-center text-gray-500 mt-1">Approved best equipment gulo</p>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {featured.map((it) => (
            <motion.div key={it._id} whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">
              <img src={it.image || "https://via.placeholder.com/600x400?text=GearNest"} className="w-full h-52 object-cover" alt={it.name} />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-lg">{it.name}</h3>
                <p className="text-sm text-gray-500">{it.category} - {it.location}</p>
                <p className="text-emerald-600 font-bold mt-2">৳{it.rentalPrice} / {it.rentalType}</p>
                <button onClick={() => goDetails(it._id)} className="mt-auto pt-3"><span className="block w-full bg-emerald-600 text-white py-2 rounded-full text-center">View Details</span></button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {featured.length === 0 && <p className="text-center text-gray-500 mt-6">No featured equipment yet - Admin ke Approve korte bolo</p>}
      </div>

      {/* categories */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {categories.map((c) => (
              <Link key={c.name} href={`/equipment?category=${encodeURIComponent(c.name)}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow text-center cursor-pointer">
                  <img src={c.img} className="w-full h-24 object-cover" alt={c.name} />
                  <p className="p-3 text-sm font-semibold">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* why choose us */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center">Why Choose Us</h2>
        <div className="grid md:grid-cols-4 gap-5 mt-8 text-center">
          <div className="bg-white p-5 rounded-2xl shadow"><h3 className="font-bold">Affordable Price</h3><p className="text-sm text-gray-500 mt-1">Kom dame valo equipment rent koro</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><h3 className="font-bold">Verified Owners</h3><p className="text-sm text-gray-500 mt-1">Sob owner verified, tension nai</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><h3 className="font-bold">Flexible Period</h3><p className="text-sm text-gray-500 mt-1">Daily, Weekly, Monthly - jemon lagbe</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><h3 className="font-bold">Secure Payment</h3><p className="text-sm text-gray-500 mt-1">Stripe diye safe payment</p></div>
        </div>
      </div>

      {/* how it works - extra 1 */}
      <div className="bg-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8 text-center">
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-2xl">1️⃣</p><h3 className="font-bold mt-2">Browse & Select</h3><p className="text-sm text-gray-500">Equipment dekho, pochondo koro</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-2xl">2️⃣</p><h3 className="font-bold mt-2">Book & Pay</h3><p className="text-sm text-gray-500">Date, Quantity diye Stripe a pay koro</p></div>
            <div className="bg-white p-5 rounded-2xl shadow"><p className="text-2xl">3️⃣</p><h3 className="font-bold mt-2">Use & Return</h3><p className="text-sm text-gray-500">Use koro, time moto return koro</p></div>
          </div>
        </div>
      </div>

      {/* trusted owners - extra 2 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center">Trusted Equipment Owners</h2>
        <p className="text-center text-gray-500 mt-1">Dhakar 500+ verified owner amader sathe ache</p>
        <div className="grid md:grid-cols-3 gap-5 mt-8 text-center">
          <div className="bg-white p-5 rounded-2xl shadow"><h3 className="font-bold">Camera House Dhaka</h3><p className="text-sm text-gray-500">120+ Camera & Lens</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><h3 className="font-bold">BuildRent BD</h3><p className="text-sm text-gray-500">80+ Construction Machine</p></div>
          <div className="bg-white p-5 rounded-2xl shadow"><h3 className="font-bold">Event Pro</h3><p className="text-sm text-gray-500">60+ Event Equipment</p></div>
        </div>
      </div>

      {/* reviews */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-emerald-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Customer Reviews</h2>
          <div className="grid md:grid-cols-4 gap-5 mt-8">
            {reviews.map((r) => (
              <div key={r.name} className="bg-white p-5 rounded-2xl shadow">
                <p>⭐ {r.rating}/5</p>
                <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
                <p className="font-bold mt-3">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
