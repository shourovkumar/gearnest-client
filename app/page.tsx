// home page - original GearNest design, fully responsive, all English
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const categories = [
  { name: "Construction Equipment", desc: "Excavators, mixers & generators", count: "120+ items", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" },
  { name: "Photography Equipment", desc: "Cameras, lenses & lighting", count: "95+ items", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80" },
  { name: "Vehicles & Transportation", desc: "Cars, vans & bikes", count: "80+ items", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" },
  { name: "Agriculture Equipment", desc: "Tractors, harvesters & tools", count: "60+ items", img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80" },
  { name: "Electronics", desc: "Drones, projectors & audio", count: "110+ items", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80" },
  { name: "Event Equipment", desc: "Sound, stage & decoration", count: "70+ items", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80" },
];

const whyChoose = [
  { title: "Fair & Transparent Pricing", desc: "No hidden charges. What you see is what you pay - daily, weekly or monthly.", icon: "৳" },
  { title: "Verified Owners", desc: "Every owner is verified and every listing is reviewed before it goes live.", icon: "✓" },
  { title: "Flexible Rental Periods", desc: "Rent for a day, a week or a month. Extend anytime from your dashboard.", icon: "◷" },
  { title: "Secure Payment", desc: "Pay safely with Stripe. Your payment is protected until your rental is confirmed.", icon: "◈" },
];

const howItWorks = [
  { step: "01", title: "Browse & Compare", desc: "Search by category, location or price. Compare specs, photos and owner ratings." },
  { step: "02", title: "Book & Pay Securely", desc: "Pick your dates, quantity and delivery address, then pay safely with Stripe." },
  { step: "03", title: "Use & Return", desc: "Receive your equipment, use it for your project, and return it on time." },
];

const owners = [
  { name: "Camera House Dhaka", meta: "120+ Cameras & Lenses", tag: "Top Rated Owner" },
  { name: "BuildRent BD", meta: "80+ Construction Machines", tag: "Verified Owner" },
  { name: "Event Pro", meta: "60+ Event Equipment", tag: "Verified Owner" },
];

const reviews = [
  { name: "Rahim Uddin", role: "Photographer, Dhaka", rating: 5, comment: "I rented a Canon camera for a wedding shoot. The camera was in excellent condition and delivery was right on time. Highly recommended." },
  { name: "Nusrat Jahan", role: "Interior Designer", rating: 5, comment: "Rented a drill machine for a home project. Fair price, helpful owner, and the booking process took less than two minutes." },
  { name: "Arif Khan", role: "Event Organizer", rating: 4, comment: "Renting a car through GearNest is now my go-to. Clean cars, clear pricing and quick confirmation." },
  { name: "Mim Akter", role: "Content Creator", rating: 5, comment: "Booked lights and sound for an event. Everything worked perfectly and the owner even helped with setup." },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch(`${API}/equipment/featured`).then((r) => r.json()).then((d) => setFeatured(d.equipments || [])).catch(() => setFeatured([]));
  }, []);

  const goDetails = (id: string) => {
    if (!token) router.push("/login");
    else router.push(`/equipment/${id}`);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/equipment${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950" />
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-emerald-300 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" /> Trusted Rental Marketplace in Bangladesh
              </span>
              <h1 className="mt-5 text-[36px] leading-[1.08] sm:text-5xl lg:text-[60px] font-extrabold tracking-tight text-white">
                Rent the equipment<br />you need, <span className="text-emerald-400">when you</span><br />need it.
              </h1>
              <p className="mt-4 text-slate-300 text-[15px] md:text-lg leading-relaxed max-w-lg">
                From cameras and cars to construction machines and event gear - rent verified equipment across Bangladesh with secure payment and flexible dates.
              </p>

              <form onSubmit={onSearch} className="mt-6 bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl shadow-black/20 max-w-xl">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search camera, car, drill, drone..." className="flex-1 px-4 py-3 rounded-xl text-slate-900 placeholder:text-slate-400 outline-none text-[15px] bg-transparent" />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-[15px] transition whitespace-nowrap">Search Equipment</button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                <span>Popular:</span>
                <button onClick={() => router.push("/equipment?search=Camera")} className="underline underline-offset-2 hover:text-white">Camera</button>
                <button onClick={() => router.push("/equipment?search=Drone")} className="underline underline-offset-2 hover:text-white">Drone</button>
                <button onClick={() => router.push("/equipment?search=Car")} className="underline underline-offset-2 hover:text-white">Car</button>
                <button onClick={() => router.push("/equipment?search=Generator")} className="underline underline-offset-2 hover:text-white">Generator</button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
                <div><p className="text-2xl md:text-3xl font-extrabold text-white">500+</p><p className="text-xs md:text-sm text-slate-400 mt-1">Equipment Listed</p></div>
                <div><p className="text-2xl md:text-3xl font-extrabold text-white">1,200+</p><p className="text-xs md:text-sm text-slate-400 mt-1">Completed Rentals</p></div>
                <div><p className="text-2xl md:text-3xl font-extrabold text-white">4.8<span className="text-amber-400 text-lg"> ★</span></p><p className="text-xs md:text-sm text-slate-400 mt-1">Average Rating</p></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
              <div className="rounded-[24px] overflow-hidden border-4 border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80" alt="Equipment rental" className="w-full h-[300px] sm:h-[360px] lg:h-[440px] object-cover" />
              </div>
              <div className="absolute -bottom-4 left-4 sm:left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</span>
                <div className="leading-tight"><p className="text-sm font-bold text-slate-900">Verified Owners Only</p><p className="text-xs text-slate-500 mt-0.5">Every listing is reviewed</p></div>
              </div>
              <div className="absolute -top-3 right-4 sm:right-6 bg-slate-900/90 backdrop-blur border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
                <span className="text-amber-400">★</span><span className="text-white text-sm font-semibold">4.8 / 5 from 2,400+ reviews</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-emerald-600 font-bold text-xs tracking-[0.18em] uppercase">Browse Categories</p>
            <h2 className="text-2xl md:text-[32px] font-extrabold tracking-tight text-slate-900 mt-2">Popular Categories</h2>
            <p className="text-slate-500 text-[15px] mt-1">Find the right gear for construction, photography, events and more.</p>
          </div>
          <Link href="/equipment" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 border border-slate-200 bg-white px-4 py-2.5 rounded-full hover:border-emerald-200 hover:text-emerald-700 transition">View All Equipment <span>→</span></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {categories.map((c) => (
            <Link key={c.name} href={`/equipment?category=${encodeURIComponent(c.name)}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <div className="relative h-40 overflow-hidden">
                <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 left-3 bg-white/95 text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-full">{c.count}</span>
              </div>
              <div className="p-4 flex items-start justify-between gap-3">
                <div><h3 className="font-bold text-slate-900 leading-tight">{c.name}</h3><p className="text-sm text-slate-500 mt-1">{c.desc}</p></div>
                <span className="w-9 h-9 shrink-0 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-emerald-600 font-bold text-xs tracking-[0.18em] uppercase">Handpicked For You</p>
              <h2 className="text-2xl md:text-[32px] font-extrabold tracking-tight text-slate-900 mt-2">Featured Equipment</h2>
              <p className="text-slate-500 text-[15px] mt-1">Top-rated and recently approved listings from verified owners.</p>
            </div>
            <Link href="/equipment" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-slate-900 px-4 py-2.5 rounded-full hover:bg-slate-800 transition">Browse All <span>→</span></Link>
          </div>

          {featured.length === 0 ? (
            <div className="mt-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <p className="font-semibold text-slate-900">No featured equipment yet</p>
              <p className="text-sm text-slate-500 mt-1">New approved equipment will appear here. Check All Equipment in the meantime.</p>
              <Link href="/equipment" className="inline-block mt-4 bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold">View All Equipment</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {featured.slice(0, 6).map((it) => {
                const img = it.image || it.images?.[0] || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";
                const price = it.rentalPrice ?? it.price ?? it.dailyRate ?? 0;
                const available = (it.quantity ?? it.availableStock ?? 1) > 0;
                const rating = it.rating || 4.8;
                return (
                  <motion.article key={it._id} whileHover={{ y: -4 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition">
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img src={img} alt={it.name} className="w-full h-full object-cover" />
                      <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${available ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>{available ? "● Available" : "Out of Stock"}</span>
                      <span className="absolute top-3 left-3 bg-white/95 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">{it.category}</span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-slate-900 leading-tight line-clamp-2">{it.name}</h3>
                      <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5"><span className="text-amber-500">★</span><span className="font-semibold text-slate-900">{rating.toFixed(1)}</span><span>({it.totalReviews || it.reviewsCount || 18} reviews)</span><span className="text-slate-300">•</span><span className="truncate">{it.location}</span></p>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{it.description || "Well-maintained equipment, ready for your next project."}</p>
                      <div className="flex items-end justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                        <p className="leading-none"><span className="text-xl font-extrabold text-emerald-600">৳{price}</span><span className="text-sm text-slate-500"> / {it.rentalType || "daily"}</span></p>
                        <button onClick={() => goDetails(it._id)} className="bg-slate-900 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition">View Details →</button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section id="why-choose" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 scroll-mt-24">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-emerald-600 font-bold text-xs tracking-[0.18em] uppercase">Why Choose Us</p>
            <h2 className="text-2xl md:text-[32px] font-extrabold tracking-tight text-slate-900 mt-2 leading-tight">Renting should be simple, safe and affordable.</h2>
            <p className="text-slate-500 text-[15px] leading-relaxed mt-3">GearNest brings owners and renters together in one place. You compare real photos, real prices and real reviews - then book in minutes.</p>
            <Link href="/register" className="inline-flex mt-6 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-slate-800 transition">List Your Equipment →</Link>
            <div className="mt-8 rounded-2xl overflow-hidden hidden lg:block">
              <img src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80" alt="Why GearNest" className="w-full h-56 object-cover" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {whyChoose.map((w) => (
              <div key={w.title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition">
                <span className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">{w.icon}</span>
                <h3 className="font-bold text-slate-900 mt-4">{w.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-1.5">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-emerald-400 font-bold text-xs tracking-[0.18em] uppercase">How It Works</p>
              <h2 className="text-2xl md:text-[32px] font-extrabold tracking-tight text-white mt-2">Book in three simple steps</h2>
              <p className="text-slate-400 text-[15px] mt-2 max-w-md">No paperwork, no phone calls. Everything happens inside GearNest - from search to payment to return.</p>
              <div className="space-y-4 mt-8">
                {howItWorks.map((s) => (
                  <div key={s.step} className="flex gap-4 bg-white/[0.06] border border-white/10 rounded-2xl p-4">
                    <span className="shrink-0 w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-sm">{s.step}</span>
                    <div><h3 className="font-bold text-white">{s.title}</h3><p className="text-sm text-slate-400 leading-relaxed mt-1">{s.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=80" alt="How it works" className="w-full h-[320px] md:h-[420px] object-cover rounded-[24px] border-4 border-white/10" />
              <div className="absolute -bottom-4 left-4 right-4 sm:left-6 sm:right-auto bg-white rounded-2xl shadow-xl p-4 sm:max-w-[320px]">
                <p className="font-bold text-slate-900">Make your work easier with GearNest</p>
                <p className="text-sm text-slate-500 mt-1">Join 500+ owners and 1,200+ happy renters across Bangladesh.</p>
                <Link href="/equipment" className="inline-block mt-3 bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full">Browse Equipment →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED OWNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-[32px] font-extrabold tracking-tight text-slate-900 text-center">Trusted Equipment Owners</h2>
        <p className="text-center text-slate-500 text-[15px] mt-1">Verified owners with consistent ratings and on-time delivery.</p>
        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {owners.map((o) => (
            <div key={o.name} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
              <span className="inline-flex bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">{o.tag}</span>
              <h3 className="font-bold text-slate-900 mt-3">{o.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{o.meta}</p>
              <Link href="/equipment" className="inline-block mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-700">View Their Equipment →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-[32px] font-extrabold tracking-tight text-slate-900 text-center">What Our Customers Say</h2>
          <p className="text-center text-slate-500 text-[15px] mt-1">Real reviews from real rentals across Bangladesh.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {reviews.map((r) => (
              <div key={r.name} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col">
                <p className="text-amber-500 tracking-wide">{"★".repeat(r.rating)}<span className="text-slate-300">{"★".repeat(5 - r.rating)}</span> <span className="text-slate-900 font-bold text-sm ml-1">{r.rating}.0</span></p>
                <p className="text-sm text-slate-600 leading-relaxed mt-3 flex-1">“{r.comment}”</p>
                <div className="mt-4 pt-4 border-t border-slate-200"><p className="font-bold text-slate-900 text-sm">{r.name}</p><p className="text-xs text-slate-500 mt-0.5">{r.role}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="bg-emerald-600 rounded-[24px] px-6 py-10 md:px-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-emerald-600/20">
          <div><h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Ready to rent? Let&apos;s get started.</h2><p className="text-emerald-100 mt-2 max-w-xl text-[15px]">Browse verified equipment, pick your dates and pay securely. Your next project is one booking away.</p></div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link href="/equipment" className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold text-center text-sm hover:bg-slate-50 transition">Browse Equipment</Link>
            <Link href="/register" className="border border-white/40 text-white px-6 py-3 rounded-full font-semibold text-center text-sm hover:bg-white/10 transition">Become an Owner</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
