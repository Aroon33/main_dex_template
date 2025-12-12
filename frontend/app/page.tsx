"use client";

export default function Home() {
  return (
    <div className="w-full space-y-10">

      {/* HERO SECTION */}
      <section
        className="
          bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl
          p-8 md:p-12 shadow-xl flex flex-col items-center text-center
        "
      >
        <h1
          className="
            text-4xl md:text-5xl font-extrabold 
            bg-gradient-to-r from-purple-400 to-blue-400 
            bg-clip-text text-transparent
          "
        >
          Welcome to PerpX Exchange
        </h1>

        <p className="text-gray-300 max-w-xl mt-4 text-lg">
          Trade perpetual futures with institutional-grade UI, powered by our decentralized engine.
        </p>
      </section>

      {/* QUICK ACTIONS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickCard title="Start Trading" href="/trade" />
        <QuickCard title="View Dashboard" href="/dashboard" />
        <QuickCard title="Stake Tokens" href="/stake" />
      </section>

    </div>
  );
}

function QuickCard({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="
        bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl
        p-6 shadow-lg hover:shadow-purple-500/20 
        transition hover:scale-[1.02] active:scale-[0.98]
        flex items-center justify-center text-lg font-semibold
      "
    >
      {title}
    </a>
  );
}
