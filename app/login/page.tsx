// login page - jwt + google
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);

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

  // google login - asol google popup, requirement onujayi
  // notun user hole backend a customer hobe
  const handleGoogleCallback = async (response: any) => {
    try {
      // google er id token theke name, email, photo ber kora
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
      router.push("/dashboard/customer");
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

    // script age theke thakle abar load korbo na
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

  return (
    <div className="min-h- flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow w-full max-w-md space-y-3">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input required className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" className="w-full border p-2 rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-emerald-600 text-white py-2 rounded-full">Login</button>

        {/* asol google button - ekhane google er button asbe */}
        <div className="flex justify-center">
          <div ref={googleBtnRef}></div>
        </div>
        {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <p className="text-xs text-center text-red-500">Google Client ID missing - .env.local a add koro</p>
        )}

        <p className="text-center text-sm">No account? <Link href="/register" className="text-emerald-600">Register</Link></p>
      </form>
    </div>
  );
}
