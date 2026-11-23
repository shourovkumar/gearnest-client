// login page - jwt + google + returnUrl
"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Kotha theke login a aschi - oi page er link
  const returnUrl = searchParams.get("returnUrl") || searchParams.get("redirect") || "";

  const goAfterLogin = (user: any) => {
    if (returnUrl) {
      router.push(returnUrl);
      return;
    }
    if (user.role === "admin") router.push("/dashboard/admin");
    else if (user.role === "owner") router.push("/dashboard/owner");
    else router.push("/dashboard/customer");
  };

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
    goAfterLogin(data.user);
  };

  const handleGoogleCallback = async (response: any) => {
    try {
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      const res = await fetch(`${API}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          photo: payload.picture,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error("Google login failed");
      login(data.token, data.user);
      toast.success("Google login successful");
      goAfterLogin(data.user);
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    const initGoogle = () => {
      const google = (window as any).google;
      if (!google || !googleBtnRef.current) return;
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
      });
      google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
        text: "continue_with",
      });
    };
    if ((window as any).google) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, []);

  // Register link a returnUrl dhore rakho - naile register a giye hariye jabe
  const registerLink = returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : "/register";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-2xl shadow w-full max-w-md space-y-3"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <p className="text-sm text-slate-500 text-center">Welcome back to GearNest</p>
        {returnUrl && (
          <p className="text-xs text-center text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
            After logging in, you will return to the previous page.
          </p>
        )}
        <input
          required
          className="w-full border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-emerald-500"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="relative">
          <input
            required
            type={showPass ? 'text' : 'password'}
            className="w-full border border-slate-200 p-2.5 pr-16 rounded-xl text-sm outline-none focus:border-emerald-500"
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
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-full font-semibold transition">
          Login
        </button>
        <div className="flex items-center gap-3 py-1">
          <span className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <span className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="flex justify-center">
          <div ref={googleBtnRef}></div>
        </div>
        {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <p className="text-xs text-center text-red-500">
            Google Client ID missing - .env.local a add koro
          </p>
        )}
        <p className="text-center text-sm">
          No account?{' '}
          <Link href={registerLink} className="text-emerald-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
