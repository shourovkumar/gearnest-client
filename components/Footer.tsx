// footer - original GearNest design, 4 columns, responsive, sticky
import Link from 'next/link';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/equipment', label: 'All Equipment' },
  { href: '/#categories', label: 'Categories' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#why-choose', label: 'Why Choose Us' },
];

const services = [
  { href: '/equipment', label: 'Equipment Rental' },
  { href: '/equipment', label: 'Flexible Booking' },
  { href: '/equipment', label: 'Secure Payment' },
  { href: '/#why-choose', label: '24/7 Support' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl">
                G
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Gear<span className="text-emerald-400">Nest</span>
              </span>
            </Link>
            <p className="text-sm font-semibold text-white mt-4">Rent Smart. Work Better.</p>
            <p className="text-sm leading-relaxed text-slate-400 mt-2">
              Your trusted platform for renting high-quality construction, photography, electronics,
              and event equipment across Bangladesh - quickly and securely.
            </p>
            <div className="flex gap-2.5 mt-5">
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold transition"
              >
                fb
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold transition"
              >
                yt
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold transition"
              >
                in
              </a>
              <a
                href="#"
                aria-label="X"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 text-white flex items-center justify-center text-xs font-bold transition"
              >
                X
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-[15px]">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-emerald-400 transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-[15px]">Our Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map(s => (
                <li key={s.label}>
                  <Link href={s.href} className="hover:text-emerald-400 transition">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-[15px]">Get in Touch</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>Dhaka, Bangladesh</li>
              <li>
                <a href="mailto:support@gearnest.com" className="hover:text-emerald-400 transition">
                  support@gearnest.com
                </a>
              </li>
              <li>
                <a href="tel:+8801700000000" className="hover:text-emerald-400 transition">
                  +880 1700 000 000
                </a>
              </li>
              <li>Sat - Thu, 9:00 AM - 9:00 PM</li>
            </ul>
            <Link
              href="/equipment"
              className="inline-block mt-5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition"
            >
              Browse Equipment →
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">© 2026 GearNest. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-slate-400">
            <Link href="/#" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <span className="text-slate-600">|</span>
            <Link href="/#" className="hover:text-white transition">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
