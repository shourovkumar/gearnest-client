// uporer navbar
"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-2">
        <Link href="/" className="text-2xl font-bold text-emerald-600">
          GearNest
        </Link>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <Link href="/equipment" className="hover:text-emerald-600">All Equipment</Link>
          {user ? (
            <>
              <span className="text-sm">Hi, {user.name}</span>
              <Link href="/dashboard" className="bg-emerald-600 text-white px-3 py-1 rounded">Dashboard</Link>
              <button onClick={logout} className="border px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-emerald-600">Login</Link>
              <Link href="/register" className="bg-emerald-600 text-white px-3 py-1 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
