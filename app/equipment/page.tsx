// sob approved equipment - search filter sort backend theke
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AllEquipmentPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [rentalType, setRentalType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    const q = new URLSearchParams({
      search,
      category,
      rentalType,
      minPrice,
      maxPrice,
      availability,
      sort,
      page: String(page),
      limit: "9",
    });
    const res = await fetch(`${API}/equipment?${q}`);
    const data = await res.json();
    setItems(data.equipments || []);
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => {
    fetchData();
  }, [category, rentalType, availability, sort, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center">All Equipment</h1>
      <p className="text-center text-gray-500 mt-1">Search, filter and book your needed equipment</p>

      {/* search + filter */}
      <div className="bg-white p-4 rounded-2xl shadow mt-6 grid md:grid-cols-3 gap-3">
        <input className="border p-2 rounded" placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="border p-2 rounded" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="all">All Category</option>
          <option value="Construction Equipment">Construction Equipment</option>
          <option value="Photography Equipment">Photography Equipment</option>
          <option value="Vehicles & Transportation">Vehicles & Transportation</option>
          <option value="Agriculture Equipment">Agriculture Equipment</option>
          <option value="Electronics">Electronics</option>
          <option value="Event Equipment">Event Equipment</option>
        </select>
        <select className="border p-2 rounded" value={rentalType} onChange={(e) => { setRentalType(e.target.value); setPage(1); }}>
          <option value="all">All Rental Type</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
        </select>
        <input type="number" className="border p-2 rounded" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" className="border p-2 rounded" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <select className="border p-2 rounded" value={availability} onChange={(e) => { setAvailability(e.target.value); setPage(1); }}>
          <option value="all">All Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <select className="border p-2 rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="new">Recently Added</option>
          <option value="low">Price Low to High</option>
          <option value="high">Price High to Low</option>
        </select>
        <button onClick={() => { setPage(1); fetchData(); }} className="bg-emerald-600 text-white rounded py-2 md:col-span-2">Search</button>
      </div>

      {/* 3 column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {items.map((it) => (
          <div key={it._id} className="bg-white rounded-2xl shadow overflow-hidden flex flex-col">
            <img src={it.image || "https://via.placeholder.com/600x400?text=GearNest"} alt={it.name} className="w-full h-52 object-cover" />
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-lg">{it.name}</h3>
              <p className="text-sm text-gray-500">{it.category} - {it.location}</p>
              <p className="text-emerald-600 font-bold mt-2">৳{it.rentalPrice} / {it.rentalType}</p>
              <p className="text-sm mt-1">{it.availability ? "✅ Available" : "❌ Not Available"} - {it.availableQuantity} pcs</p>
              <Link href={`/equipment/${it._id}`} className="mt-auto pt-4">
                <button className="w-full bg-emerald-600 text-white py-2 rounded-full">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && <p className="text-center mt-10 text-gray-500">No equipment found</p>}

      {/* pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border px-4 py-1 rounded disabled:opacity-50">Prev</button>
        <span className="px-3 py-1">Page {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border px-4 py-1 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
