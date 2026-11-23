"use client";
import { useEffect, useState } from "react";

// FINAL - Circle spinner off, sudhu progress bar
export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    const conn: any = (navigator as any).connection;
    const type = conn?.effectiveType || "4g";
    const downlink = conn?.downlink || 10;

    let minTime = 700;
    let maxTime = 1000;

    if (type === "slow-2g" || type === "2g") {
      minTime = 1000;
      maxTime = 2200;
    } else if (type === "3g") {
      minTime = 800;
      maxTime = 1600;
    } else {
      if (downlink >= 10) {
        minTime = 700;
        maxTime = 1000;
      } else if (downlink >= 5) {
        minTime = 800;
        maxTime = 1200;
      } else {
        minTime = 900;
        maxTime = 1400;
      }
    }

    const start = performance.now();

    const progressTimer = setInterval(() => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(95, (elapsed / maxTime) * 100));
    }, 30);

    const hideTimer = setTimeout(() => {
      setProgress(100);
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 500);
    }, minTime);

    const maxTimer = setTimeout(() => {
      setProgress(100);
      setFadeOut(true);
      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 500);
    }, maxTime);

    document.body.style.overflow = "hidden";

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
      clearTimeout(maxTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center px-4 transition-all duration-500 ease-out ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div
        className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all duration-700 ease-out ${
          mounted ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <span className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold">G</span>
      </div>

      <h1 className="mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
        Gear<span className="text-emerald-600">Nest</span>
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 text-center">
        Preparing your rental experience...
      </p>

      {/* Circle spinner ekhane chilo - off kore deya hoise */}

      <div className="mt-6 w-40 sm:w-56 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-xs text-slate-400 tabular-nums">{Math.round(progress)}%</p>
    </div>
  );
}
