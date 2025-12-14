export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card p-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted mt-1">
          Overview of your account activity and performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-5">
          <div className="text-sm text-muted">Account Equity</div>
          <div className="text-2xl font-semibold mt-1">$12,450.32</div>
        </div>

        <div className="card p-5">
          <div className="text-sm text-muted">Available Margin</div>
          <div className="text-2xl font-semibold mt-1">$4,892.10</div>
        </div>

        <div className="card p-5">
          <div className="text-sm text-muted">Unrealized PnL</div>
          <div className="text-2xl font-semibold mt-1 text-bid">+$324.88</div>
        </div>
      </div>

      {/* Positions */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Open Positions</h2>

        <div className="text-sm text-muted">
          No open positions.
        </div>
      </div>

    </div>
  );
}
