export default function AirdropPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Airdrop</h1>
        <p className="text-muted">
          Check eligibility for upcoming token distributions.
        </p>
      </div>

      <div className="card p-5">
        <div className="text-muted text-sm">Eligibility Status</div>
        <div className="text-xl font-bold">Not Connected</div>
      </div>

    </div>
  );
}
