"use client";

export default function Home() {
  return (
    <div className="app-root space-y-16">

      {/* HERO */}
      <section className="panel p-10 text-center">
        <h1 className="text-5xl font-bold">
          PerpX Exchange
        </h1>

        <p className="text-muted mt-4 text-lg max-w-2xl mx-auto">
          Trade perpetual futures with institutional-grade UX,
          powered by decentralized infrastructure.
        </p>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="24h Volume" value="$3.37B" />
        <Stat label="Total Volume" value="$139.2B" />
        <Stat label="Active Traders" value="147,278" />
      </section>

      {/* ACTIONS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard title="Start Trading" href="/trade" />
        <ActionCard title="View Dashboard" href="/dashboard" />
        <ActionCard title="Stake Assets" href="/stake" />
      </section>

    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-6 text-center">
      <div className="text-muted text-sm mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function ActionCard({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="card p-8 text-center hover:opacity-90 transition"
    >
      <div className="text-lg font-semibold">{title}</div>
    </a>
  );
}
