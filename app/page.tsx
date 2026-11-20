// home page, pore ekhane sob section add korbo
export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-emerald-600 text-white rounded-2xl p-10 text-center">
        <h2 className="text-4xl font-bold">Rent Any Equipment Easily</h2>
        <p className="mt-3">Camera, tools, sound, lighting - sob kichu ek jaygay.</p>
        <a
          href="/equipment"
          className="inline-block mt-6 bg-white text-emerald-700 px-6 py-3 rounded-full font-bold"
        >
          Browse Equipment
        </a>
      </div>
      <p className="text-center mt-8 text-slate-500">
        Home page pore full design korbo - Step 4 a
      </p>
    </div>
  );
}
