export default function RewardsPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Rewards</h1>
        <p className="text-muted">Claimable and upcoming rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="card p-5">
          <div className="text-muted text-sm mb-1">Claimable</div>
          <div className="text-2xl font-bold">$0.00</div>
        </div>

        <div className="card p-5">
          <div className="text-muted text-sm mb-1">Pending</div>
          <div className="text-2xl font-bold">$24.18</div>
        </div>

      </div>

    </div>
  );
}
