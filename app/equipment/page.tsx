// all equipment - original GearNest design, sidebar filters + responsive grid, backend filters kept
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

function AllEquipmentContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [rentalType, setRentalType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // FIX: overrides diye fetch - stale state diye fetch hobe na, Clear / Search thik kaj korbe
  const fetchData = async (overrides: any = {}) => {
    setLoading(true);
    try {
      const s = overrides.search !== undefined ? overrides.search : search;
      const loc = overrides.location !== undefined ? overrides.location : location;
      const cat = overrides.category !== undefined ? overrides.category : category;
      const rt = overrides.rentalType !== undefined ? overrides.rentalType : rentalType;
      const minP = overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
      const maxP = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
      const availOnly = overrides.availableOnly !== undefined ? overrides.availableOnly : availableOnly;
      const avail = overrides.availability !== undefined ? overrides.availability : availability;
      const sortVal = overrides.sort !== undefined ? overrides.sort : sort;
      const pageVal = overrides.page !== undefined ? overrides.page : page;
      const q = new URLSearchParams({
        search: s || "",
        location: loc || "",
        category: cat || "all",
        rentalType: rt || "all",
        minPrice: minP || "",
        maxPrice: maxP || "",
        availability: availOnly ? "true" : avail || "all",
        availableOnly: availOnly ? "true" : "false",
        sort: sortVal || "new",
        page: String(pageVal),
        limit: "9",
      });
      const res = await fetch(`${API}/equipment?${q}`);
      const data = await res.json();
      // backend shape: equipments / data / equipment - sob handle
      const list = data.equipments || data.data || data.equipment || [];
      setItems(list);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total ?? list.length ?? 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Sync when coming from Home search / category
  useEffect(() => {
    const s = searchParams.get("search") || "";
    const c = searchParams.get("category") || "all";
    if (s !== search || c !== category) {
      setSearch(s);
      setCategory(c);
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, rentalType, availability, availableOnly, sort, page]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);
    fetchData({ page: 1 });
    setShowFilters(false);
  };

  const handleClear = () => {
    const cleared = {
      search: "",
      location: "",
      category: "all",
      rentalType: "all",
      minPrice: "",
      maxPrice: "",
      availability: "all",
      availableOnly: false,
      sort: "new",
      page: 1,
    };
    setSearch("");
    setLocation("");
    setCategory("all");
    setRentalType("all");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
    setAvailableOnly(false);
    setSort("new");
    setPage(1);
    setShowFilters(false);
    // FIX: cleared value diye direct fetch, setTimeout + stale state na
    fetchData(cleared);
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  const filtersPanel = (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900 flex items-center gap-2"><span className="text-emerald-600">▽</span> Filters</h2>
        <button onClick={handleClear} className="text-xs font-semibold text-slate-500 hover:text-red-600">Clear All</button>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Category</p>
        <div className="mt-3 space-y-2.5">
          <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
            <input type="radio" name="cat" checked={category === "all"} onChange={() => { setCategory("all"); setPage(1); }} className="accent-emerald-600" /> All Categories
          </label>
          {CATEGORIES.map((c) => (
            <label key={c} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input type="radio" name="cat" checked={category === c} onChange={() => { setCategory(c); setPage(1); }} className="accent-emerald-600" /> {c}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Location</p>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Dhaka, Sylhet..." className="mt-3 w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Rental Type</p>
        <div className="mt-3 space-y-2.5">
          <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
            <input type="radio" name="rtype" checked={rentalType === "all"} onChange={() => { setRentalType("all"); setPage(1); }} className="accent-emerald-600" /> All Types
          </label>
          {RENTAL_TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input type="radio" name="rtype" checked={rentalType === t} onChange={() => { setRentalType(t); setPage(1); }} className="accent-emerald-600" /> {t}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Price Range</p>
        <div className="mt-3 flex items-center gap-2">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min ৳" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
          <span className="text-slate-400">-</span>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max ৳" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Availability</p>
        <label className="flex items-center gap-2.5 text-sm text-slate-700 mt-3 cursor-pointer">
          <input type="checkbox" checked={availableOnly} onChange={(e) => { setAvailableOnly(e.target.checked); setPage(1); }} className="accent-emerald-600 w-4 h-4" /> Available Only
        </label>
      </div>

      <button onClick={() => handleSearch()} className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-sm font-semibold transition">Apply Filters</button>
      <button onClick={handleClear} className="mt-2 w-full border border-slate-200 hover:border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium transition">Clear All Filters</button>
    </div>
  );

  return (
    <div className="bg-slate-50">
      {/* Header banner */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 flex items-center justify-between gap-8">
          <div>
            <p className="text-emerald-400 text-xs font-bold tracking-[0.18em] uppercase">— Explore &amp; Rent —</p>
            <h1 className="text-3xl md:text-[44px] leading-tight font-extrabold tracking-tight text-white mt-2">All Equipment</h1>
            <p className="text-slate-400 text-[15px] mt-1">Find the perfect equipment for your project or event.</p>
          </div>
          <div className="hidden md:block shrink-0">
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" alt="Equipment" className="w-[220px] h-[130px] object-cover rounded-2xl border-4 border-white/10" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Search + Sort */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by equipment name, category or brand..." className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none bg-transparent placeholder:text-slate-400" />
            <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">Search</button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-slate-500">Sort by:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium outline-none">
              <option value="new">Recently Added</option>
              <option value="low">Price Low to High</option>
              <option value="high">Price High to Low</option>
            </select>
          </div>
        </form>

        {/* Mobile filter toggle */}
        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden mt-4 w-full bg-white border border-slate-200 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
          {showFilters ? "Hide Filters ↑" : "Show Filters ↓"} <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{category !== "all" || rentalType !== "all" || availableOnly ? "Active" : "Filters"}</span>
        </button>
        {showFilters && <div className="lg:hidden mt-4">{filtersPanel}</div>}

        <div className="flex gap-6 mt-6 items-start">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24">{filtersPanel}</aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500">
              {loading ? "Loading equipment..." : `Showing ${items.length} of ${totalCount || items.length} equipment`}
              {category !== "all" && <span className="text-slate-900 font-semibold"> • {category}</span>}
            </p>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 h-[340px] animate-pulse" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center mt-5">
                <p className="font-bold text-slate-900 text-lg">No equipment found</p>
                <p className="text-sm text-slate-500 mt-1">Try a different search, category or price range.</p>
                <button onClick={handleClear} className="mt-4 bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold">Clear All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
                {items.map((it) => {
                  const img = it.image || it.images?.[0] || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80";
                  const price = Number(it.rentalPrice) > 0 ? Number(it.rentalPrice) : (Number(it.pricePerDay) || Number(it.price) || 0);
                  const available = it.availability !== false && (it.availableQuantity ?? it.quantity ?? 1) > 0;
                  const rating = it.rating || 4.8;
                  return (
                    <article key={it._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all">
                      <div className="relative h-48 overflow-hidden bg-slate-100">
                        <img src={img} alt={it.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${available ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>{available ? "● Available" : "Not Available"}</span>
                        <span className="absolute top-3 left-3 bg-white/95 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full truncate max-w-[160px]">{it.category}</span>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-slate-900 leading-tight line-clamp-2">{it.name}</h3>
                        <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5"><span className="text-amber-500">★</span><span className="font-semibold text-slate-900">{typeof rating === "number" ? rating.toFixed(1) : rating}</span><span>({it.totalReviews || it.reviewsCount || 18} reviews)</span></p>
                        <p className="text-sm text-slate-500 mt-1 truncate">📍 {it.location}</p>
                        <p className="text-sm text-slate-500 mt-1">{available ? "✅" : "❌"} Available - {it.availableQuantity ?? it.quantity ?? 1} pcs</p>
                        <div className="flex items-end justify-between gap-3 mt-4 pt-4 border-t border-slate-100 mt-auto">
                          <p className="leading-none"><span className="text-lg font-extrabold text-emerald-600">৳{price}</span><span className="text-sm text-slate-500"> / {it.rentalType || "daily"}</span></p>
                          <Link href={`/equipment/${it._id}`} className="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold px-3.5 py-2.5 rounded-full transition whitespace-nowrap">View Details →</Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:border-slate-300">← Prev</button>
                {pageNumbers.map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-semibold ${p === page ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"}`}>{p}</button>
                ))}
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:border-slate-300">Next →</button>
              </div>
            )}

            {/* Custom rental CTA */}
            <div className="mt-10 bg-[#f5efe6] rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex gap-3">
                <span className="text-2xl">🤝</span>
                <div><h3 className="font-bold text-slate-900">Need a Custom Rental?</h3><p className="text-sm text-slate-500 mt-0.5">Tell us what you need, and we will help you find the right equipment.</p></div>
              </div>
              <Link href="/#why-choose" className="shrink-0 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-slate-800 transition">Contact Us →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AllEquipmentPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">Loading equipment...</div>}>
      <AllEquipmentContent />
    </Suspense>
  );
}
