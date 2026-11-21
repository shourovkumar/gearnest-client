// theme toggle - dark / light + localstorage
"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gearnest-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("gearnest-theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("gearnest-theme", "dark");
      setDark(true);
    }
  };

  return (
    <button onClick={toggle} className="border px-3 py-1 rounded-full text-sm">
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
