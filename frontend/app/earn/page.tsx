export default function EarnPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Earn</h1>
        <p className="text-muted">
          Earn rewards by providing liquidity and trading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="card p-5">
          <div className="text-muted text-sm mb-1">Trading Rewards</div>
          <div className="text-xl font-bold">Active</div>
        </div>

        <div className="card p-5">
          <div className="text-muted text-sm mb-1">Liquidity Program</div>
          <div className="text-xl font-bold">Coming Soon</div>
        </div>

      </div>

    </div>
  );
}
