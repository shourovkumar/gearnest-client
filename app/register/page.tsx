// register page - auto login + returnUrl
"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function RegisterContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("customer");
  const [msg, setMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const returnUrl = searchParams.get("returnUrl") || searchParams.get("redirect") || "";

  const checkLength = password.length >= 6;
  const checkUpper = /[A-Z]/.test(password);
  const checkLower = /[a-z]/.test(password);
  const isPassValid = checkLength && checkUpper && checkLower;

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (!isPassValid) {
      setMsg("Password must be at least 6 characters with one uppercase and one lowercase letter.");
      return;
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.message);
      return;
    }

    let token = data.token;
    let user = data.user;
    if (!token) {
      const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        token = loginData.token;
        user = loginData.user;
      }
    }

    if (token && user) {
      login(token, user);
      toast.success("Registration successful");
      // Age returnUrl thakle oi page ei fire jabe, naile dashboard
      if (returnUrl) {
        router.push(returnUrl);
      } else if (user.role === "admin") router.push("/dashboard/admin");
      else if (user.role === "owner") router.push("/dashboard/owner");
      else router.push("/dashboard/customer");
    } else {
      router.push("/login");
    }
  };

  const loginLink = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/login";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-emerald-600 mb-1 text-center">Register</h1>
        <p className="text-sm text-slate-500 text-center mb-4">Create your GearNest account</p>
        {returnUrl && (
          <p className="text-xs text-center text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-3">
            Once you register, you will be taken back to the previous page.
          </p>
        )}
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            className="border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-emerald-500"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-emerald-500"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              className="border border-slate-200 p-2.5 pr-16 rounded-xl text-sm outline-none focus:border-emerald-500 w-full"
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 hover:text-emerald-600"
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-sm">
            <p className={checkLength ? 'text-emerald-600 font-medium' : 'text-red-500'}>
              {checkLength ? '✓' : '✗'} At least 6 characters
            </p>
            <p className={checkUpper ? 'text-emerald-600 font-medium' : 'text-red-500'}>
              {checkUpper ? '✓' : '✗'} One uppercase letter
            </p>
            <p className={checkLower ? 'text-emerald-600 font-medium' : 'text-red-500'}>
              {checkLower ? '✓' : '✗'} One lowercase letter
            </p>
          </div>
          <select
            className="border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-emerald-500"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="owner">Owner</option>
          </select>
          {msg && <p className="text-red-500 text-sm">{msg}</p>}
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-full font-semibold transition">
            Register
          </button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{' '}
          <Link href={loginLink} className="text-emerald-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
