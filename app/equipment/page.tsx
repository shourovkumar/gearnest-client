// sob equipment er page - search + filter + pagination
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AllEquipment() {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = () => {
    console.log("API URL:", API);
    fetch(`${API}/equipment?search=${search}&category=${category}&page=${page}&limit=9`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Equipment data:", data);
        setEquipments(data.equipments || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.log("Fetch error:", err));
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">All Equipment</h1>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Search camera, drill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Category</option>
          <option value="Cameras">Cameras</option>
          <option value="Tools">Tools</option>
          <option value="Outdoor">Outdoor</option>
          <option value="Audio">Audio</option>
        </select>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded">Search</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {equipments.map((item) => (
          <div key={item._id} className="bg-white rounded shadow overflow-hidden">
            <img src={item.image || "https://via.placeholder.com/400x200?text=GearNest"} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.category} - {item.location}</p>
              <p className="text-emerald-600 font-bold mt-2">৳{item.pricePerDay} / day</p>
              <Link href={`/equipment/${item._id}`} className="inline-block mt-2 bg-emerald-600 text-white px-3 py-1 rounded text-sm">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {equipments.length === 0 && <p className="mt-4">No equipment found.</p>}

      <div className="flex gap-2 mt-6 justify-center">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="border px-3 py-1 rounded disabled:opacity-50">Prev</button>
        <span className="px-3 py-1">Page {page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border px-3 py-1 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
