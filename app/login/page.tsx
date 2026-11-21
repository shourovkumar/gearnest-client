// login page - jwt + google
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || "Login failed");
    login(data.token, data.user);
    toast.success("Login successful");
    if (data.user.role === "admin") router.push("/dashboard/admin");
    else if (data.user.role === "owner") router.push("/dashboard/owner");
    else router.push("/dashboard/customer");
  };

  // google login - default customer hobe backend a
  const handleGoogle = async () => {
    const name = prompt("Google Name likho (demo er jonno):") || "Google User";
    const gEmail = prompt("Google Email likho:") || "google@gmail.com";
    const photo = "https://i.ibb.co/5GzXkwq/user.png";
    const res = await fetch(`${API}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: gEmail, photo }),
    });
    const data = await res.json();
    if (!res.ok) return toast.error("Google login failed");
    login(data.token, data.user);
    toast.success("Google login successful");
    router.push("/dashboard/customer");
  };

  return (
    <div className="min-h- flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow w-full max-w-md space-y-3">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input required className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" className="w-full border p-2 rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-emerald-600 text-white py-2 rounded-full">Login</button>
        <button type="button" onClick={handleGoogle} className="w-full border py-2 rounded-full">Continue with Google</button>
        <p className="text-center text-sm">No account? <Link href="/register" className="text-emerald-600">Register</Link></p>
      </form>
    </div>
  );
}
