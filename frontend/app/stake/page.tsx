export default function StakePage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Stake</h1>
        <p className="text-muted">Stake tokens to earn protocol rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="text-muted text-sm">Staked Amount</div>
          <div className="text-2xl font-bold">0.00 PX</div>
        </div>

        <div className="card p-5">
          <div className="text-muted text-sm">APR</div>
          <div className="text-2xl font-bold">-- %</div>
        </div>
      </div>

    </div>
  );
}
