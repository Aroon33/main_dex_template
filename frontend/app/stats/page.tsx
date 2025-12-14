export default function StatsPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Statistics</h1>
        <p className="text-muted">Protocol-wide trading metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-muted text-sm">24h Volume</div>
          <div className="text-xl font-bold">$3.37B</div>
        </div>

        <div className="card p-5">
          <div className="text-muted text-sm">Total Volume</div>
          <div className="text-xl font-bold">$139.2B</div>
        </div>

        <div className="card p-5">
          <div className="text-muted text-sm">Active Traders</div>
          <div className="text-xl font-bold">147,278</div>
        </div>
      </div>

    </div>
  );
}
