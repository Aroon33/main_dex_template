"use client";

export default function Hero() {
  return (
    <section className="py-20 px-6 text-center">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Trade Perpetuals. Own Your Positions.
      </h1>

      <p className="mt-6 text-gray-300 max-w-xl mx-auto">
        PerpX is a decentralized perpetual exchange built for traders who demand control,
        transparency, and performance.
      </p>

      <div className="mt-10 flex flex-col gap-4 items-center">
        <a
          href="/trade"
          className="px-8 py-3 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          取引を始める →
        </a>

        <button className="text-gray-400 text-sm">
          アプリをダウンロード
        </button>
      </div>
    </section>
  );
}
