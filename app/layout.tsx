// sob page er main layout
import { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
