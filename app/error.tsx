// error page - kono page a error hole dekhabe
"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="min-h- flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold">Something went wrong!</h1>
      <p className="text-gray-500 mt-2">Try again, problem thik hoye jabe.</p>
      <button onClick={() => reset()} className="mt-5 bg-emerald-600 text-white px-6 py-2 rounded-full">Try Again</button>
    </div>
  );
}
