// home page
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [equipments, setEquipments] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/equipment`)
      .then((res) => res.json())
      .then((data) => setEquipments(data.equipments || []));
  }, []);

  return (
    <div>
      <div className="bg-emerald-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Rent Anything, From GearNest</h1>
        <p className="mt-2">Camera, Tools, Outdoor - sob ek jaygay</p>
        <Link href="/equipment" className="inline-block mt-4 bg-white text-emerald-600 px-5 py-2 rounded font-bold">
          Browse Equipment
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Featured Equipment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {equipments.slice(0, 6).map((item) => (
            <div key={item._id} className="bg-white rounded shadow overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
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
        {equipments.length === 0 && <p>No equipment yet. Add from Postman.</p>}
      </div>
    </div>
  );
}
