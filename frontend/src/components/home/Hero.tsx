export default function Hero() {
  return (
    <section className="text-center py-24">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
        Trade Perpetual Futures<br/>With Zero Hassle
      </h1>

      <p className="text-gray-400 mt-6 text-lg md:text-xl max-w-2xl mx-auto">
        PerpX lets you trade perpetual contracts with deep liquidity, lightning-fast execution,
        and complete decentralization.
      </p>

      <div className="mt-10">
        <a
          href="/trade"
          className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-lg shadow-lg transition"
        >
          Start Trading →
        </a>
      </div>
    </section>
  );
}
