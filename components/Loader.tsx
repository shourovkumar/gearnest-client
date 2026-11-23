"use client";
import { useEffect, useState } from "react";

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const conn: any = (navigator as any).connection;
    const type = conn?.effectiveType || "4g";
    const downlink = conn?.downlink || 10;

    let minTime = 600;
    let maxTime = 1400;

    if (type === "slow-2g" || type === "2g") {
      minTime = 1200;
      maxTime = 3500;
    } else if (type === "3g") {
      minTime = 900;
      maxTime = 2200;
    } else {
      if (downlink >= 10) {
        minTime = 450;
        maxTime = 900;
      } else if (downlink >= 5) {
        minTime = 600;
        maxTime = 1200;
      } else {
        minTime = 800;
        maxTime = 1800;
      }
    }

    const start = performance.now();
    let hideTimer: any;
    let maxTimer: any;
    let fadeTimer: any;

    const hideLoader = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, minTime - elapsed);
      hideTimer = setTimeout(() => {
        setFadeOut(true);
        fadeTimer = setTimeout(() => setVisible(false), 300);
      }, remaining);
    };

    maxTimer = setTimeout(() => {
      setFadeOut(true);
      fadeTimer = setTimeout(() => setVisible(false), 300);
    }, maxTime);

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader, { once: true });
    }

    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(maxTimer);
      clearTimeout(fadeTimer);
      window.removeEventListener("load", hideLoader);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center px-4 transition-opacity duration-300 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
        <span className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold">G</span>
      </div>

      <h1 className="mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
        Gear<span className="text-emerald-600">Nest</span>
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 text-center">
        Preparing your rental experience...
      </p>

      <div className="mt-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full border- border-slate-200 border-t-emerald-600 animate-spin" />

      <div className="mt-6 w-40 sm:w-56 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-emerald-600 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
