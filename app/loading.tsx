// loading page - route change hole dekhabe
export default function Loading() {
  return (
    <div className="min-h- flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-3 text-gray-500">Loading GearNest...</p>
    </div>
  );
}
