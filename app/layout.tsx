// main layout, sob page er header footer ekhan theke asbe
import "./globals.css";

export const metadata = {
  title: "GearNest - Equipment Rental",
  description: "Rent any equipment easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b py-4">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-emerald-600">GearNest</h1>
            <nav className="flex gap-4">
              <a href="/">Home</a>
              <a href="/equipment">All Equipment</a>
              <a href="/login">Login</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-emerald-700 text-white text-center py-6 mt-10">
          <p>© 2026 GearNest. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
