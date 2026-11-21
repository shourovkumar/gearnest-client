// navbar - role wise dashboard
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const dashboardLink = user?.role === "admin" ? "/dashboard/admin" : user?.role === "owner" ? "/dashboard/owner" : "/dashboard/customer";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-emerald-600">GearNest</Link>
        <div className="hidden md:flex gap-5 items-center">
          <Link href="/">Home</Link>
          <Link href="/equipment">All Equipment</Link>
          {user && <Link href={dashboardLink} className="text-emerald-600 font-semibold">Dashboard</Link>}
          {user?.role === "customer" && <Link href="/dashboard/customer">Favorites</Link>}
        </div>
        <div className="flex gap-2 items-center">
          {!user ? (
            <>
              <Link href="/login" className="border px-4 py-1 rounded-full">Login</Link>
              <Link href="/register" className="bg-emerald-600 text-white px-4 py-1 rounded-full">Register</Link>
            </>
          ) : (
            <>
              <span className="hidden md:block text-sm">{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded-full">Logout</button>
            </>
          )}
        </div>
      </div>
      {/* mobile menu */}
      <div className="md:hidden flex gap-4 px-4 pb-3 text-sm">
        <Link href="/">Home</Link>
        <Link href="/equipment">All Equipment</Link>
        {user && <Link href={dashboardLink} className="text-emerald-600 font-semibold">Dashboard</Link>}
      </div>
    </nav>
  );
}
