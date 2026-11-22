// navbar - role wise dashboard, responsive, original GearNest design
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/equipment', label: 'All Equipment' },
  { href: '/#categories', label: 'Categories' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#why-choose', label: 'Why Choose Us' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const dashboardLink =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'owner'
        ? '/dashboard/owner'
        : '/dashboard/customer';

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-slate-100 shadow-[0_1px_12px_rgba(15,23,42,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-[72px] items-center justify-between gap-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            onClick={() => setOpen(false)}
          >
            <span className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/25">
              G
            </span>
            <span className="leading-none">
              <span className="block text-xl md:text-[22px] font-extrabold tracking-tight text-slate-900">
                Gear<span className="text-emerald-600">Nest</span>
              </span>
              <span className="block text-[10px] md:text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase mt-1">
                Rent Anything
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3.5 py-2 rounded-full text-[14px] font-medium transition ${
                  isActive(l.href)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                href={dashboardLink}
                className="ml-1 px-3.5 py-2 rounded-full text-[14px] font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/equipment"
              aria-label="Search equipment"
              className="hidden sm:flex w-10 h-10 rounded-full border border-slate-200 items-center justify-center text-slate-600 hover:border-emerald-200 hover:text-emerald-600 transition"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>

            {!user ? (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-4 py-2 rounded-full border border-slate-200 text-[14px] font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-emerald-600 text-white text-[14px] font-semibold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="hidden md:flex flex-col items-end leading-tight mr-1">
                  <span className="text-[13px] font-semibold text-slate-900 truncate max-w-[140px]">
                    {user.name}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wide capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full bg-slate-900 text-white text-[14px] font-semibold hover:bg-slate-800 transition"
                >
                  Logout
                </button>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="lg:hidden w-10 h-10 rounded-full border border-slate-200 flex flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={`block w-5 h-[2px] bg-slate-900 transition ${open ? 'rotate-45 translate-y-[7px]' : ''}`}
              />
              <span
                className={`block w-5 h-[2px] bg-slate-900 transition ${open ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-5 h-[2px] bg-slate-900 transition ${open ? '-rotate-45 -translate-y-[7px]' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-[15px] font-medium ${isActive(l.href) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                href={dashboardLink}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-xl text-[15px] font-semibold bg-slate-900 text-white mt-1 text-center"
              >
                Go to Dashboard
              </Link>
            )}
            {user?.role === 'customer' && (
              <Link
                href="/dashboard/customer"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-xl text-[15px] font-medium text-slate-700 hover:bg-slate-50"
              >
                My Favorites
              </Link>
            )}
            {!user && (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-xl text-[15px] font-medium text-slate-700 border border-slate-200 text-center mt-2"
              >
                Login
              </Link>
            )}
            {user && (
              <div className="flex items-center justify-between px-3 py-2 mt-2 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-900">
                  {user.name} <span className="text-slate-500 font-normal">({user.role})</span>
                </span>
                <button onClick={handleLogout} className="text-sm font-semibold text-red-600">
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
