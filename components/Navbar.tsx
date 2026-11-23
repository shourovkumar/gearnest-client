// navbar - role wise dashboard, responsive, original GearNest design
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  const dashboardLink =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'owner'
        ? '/dashboard/owner'
        : '/dashboard/customer';

  const handleLogout = () => {
    logout();
    setOpen(false);
    setShowSearch(false);
    router.push('/login');
  };

  useEffect(() => {
    const q = searchText.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setHighlight(-1);
      return;
    }
    setSuggestLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/equipment?search=${encodeURIComponent(q)}&limit=5`);
        const data = await res.json();
        const list = data.equipments || data.data || data.equipment || [];
        setSuggestions(list.slice(0, 5));
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (highlight >= 0 && suggestions[highlight]) {
      const item = suggestions[highlight];
      setShowSearch(false);
      setOpen(false);
      router.push(`/equipment/${item._id}`);
      return;
    }
    const q = searchText.trim();
    if (q) {
      router.push(`/equipment?search=${encodeURIComponent(q)}`);
    } else {
      router.push('/equipment');
    }
    setShowSearch(false);
    setOpen(false);
  };

  const goToSuggestion = (item: any) => {
    setShowSearch(false);
    setOpen(false);
    setSearchText('');
    setSuggestions([]);
    router.push(`/equipment/${item._id}`);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const showDropdown = showSearch && searchText.trim().length >= 2;

  return (
    <>
      {showSearch && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowSearch(false)} />
      )}

      <header className="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-slate-100 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-18 items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => { setOpen(false); setShowSearch(false); }}>
              <span className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/25">G</span>
              <span className="leading-none">
                <span className="block text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">Gear<span className="text-emerald-600">Nest</span></span>
                <span className="block text-xs font-semibold tracking-widest text-slate-500 uppercase mt-1">Rent Anything</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${isActive(l.href) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>{l.label}</Link>
              ))}
              {user && (
                <Link href={dashboardLink} className="ml-1 px-3.5 py-2 rounded-full text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition">Dashboard</Link>
              )}
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowSearch(!showSearch)} aria-label="Search equipment" className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${showSearch ? 'border-emerald-600 text-emerald-600 bg-emerald-50' : 'border-slate-200 text-slate-600 hover:border-emerald-200 hover:text-emerald-600'}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              {!user ? (
                <>
                  <Link href="/login" className="hidden sm:inline-flex px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition">Login</Link>
                  <Link href="/register" className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition">Register</Link>
                </>
              ) : (
                <>
                  <div className="hidden md:flex flex-col items-end leading-tight mr-1">
                    <span className="text-xs font-semibold text-slate-900 truncate max-w-36">{user.name}</span>
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide capitalize">{user.role}</span>
                  </div>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition">Logout</button>
                </>
              )}

              <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="lg:hidden w-10 h-10 rounded-full border border-slate-200 flex flex-col items-center justify-center gap-1">
                <span className={`block w-5 h-0.5 bg-slate-900 transition ${open ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-slate-900 transition ${open ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-slate-900 transition ${open ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className={`absolute top-full left-0 right-0 px-4 sm:px-6 pt-2 pb-2 transition-all duration-300 ease-out ${showSearch ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="max-w-xl mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 flex gap-2 items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 ml-2 shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                autoFocus={showSearch}
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setHighlight(-1); }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setShowSearch(false);
                  if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((p) => Math.min(p + 1, suggestions.length - 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((p) => Math.max(p - 1, -1)); }
                }}
                placeholder="Search equipment... e.g. Camera, Drill, Projector"
                className="flex-1 min-w-0 outline-none text-sm py-2"
              />
              <button type="submit" className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full transition">Search</button>
              <button type="button" onClick={() => setShowSearch(false)} className="shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50">X</button>
            </form>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-80 overflow-y-auto">
                {suggestLoading ? (
                  <p className="px-4 py-4 text-sm text-slate-500 text-center">Searching...</p>
                ) : suggestions.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-slate-500 text-center">No match for <span className="font-semibold text-slate-900">{searchText}</span> - Enter diye sob result dekho</p>
                ) : (
                  <>
                    {suggestions.map((item: any, idx: number) => {
                      const price = Number(item.rentalPrice) > 0 ? Number(item.rentalPrice) : (Number(item.pricePerDay) || 0);
                      return (
                        <button key={item._id} onClick={() => goToSuggestion(item)} onMouseEnter={() => setHighlight(idx)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${highlight === idx ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}>
                          <img src={item.image || item.images?.[0] || 'https://via.placeholder.com/80x80?text=GearNest'} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-semibold text-slate-900 truncate">{item.name}</span>
                            <span className="block text-xs text-slate-500 truncate">{item.category} - {item.location}</span>
                          </span>
                          <span className="text-sm font-bold text-emerald-600 shrink-0">৳{price.toLocaleString()}</span>
                        </button>
                      );
                    })}
                    <button onClick={handleSearchSubmit} className="w-full px-4 py-3 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-t border-slate-100">See all results for {searchText} →</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`px-3 py-2.5 rounded-xl text-base font-medium ${isActive(l.href) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}>{l.label}</Link>
              ))}
              {user && (
                <Link href={dashboardLink} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-xl text-base font-semibold bg-slate-900 text-white mt-1 text-center">Go to Dashboard</Link>
              )}
              {user?.role === 'customer' && (
                <Link href="/dashboard/customer" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50">My Favorites</Link>
              )}
              {!user && (
                <Link href="/login" onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 border border-slate-200 text-center mt-2">Login</Link>
              )}
              {user && (
                <div className="flex items-center justify-between px-3 py-2 mt-2 bg-slate-50 rounded-xl">
                  <span className="text-sm font-semibold text-slate-900">{user.name} <span className="text-slate-500 font-normal">({user.role})</span></span>
                  <button onClick={handleLogout} className="text-sm font-semibold text-red-600">Logout</button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
