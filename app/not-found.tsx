// 404 page
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h- flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-gray-500 mt-2">Page not found</p>
      <Link href="/"><button className="mt-5 bg-emerald-600 text-white px-6 py-2 rounded-full">Go Home</button></Link>
    </div>
  );
}
