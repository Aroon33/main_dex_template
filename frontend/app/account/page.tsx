export default function AccountPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Account</h1>
        <p className="text-muted">Wallet and profile overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="card p-5">
          <div className="text-muted text-sm mb-1">Wallet Status</div>
          <div className="text-lg font-medium">Not Connected</div>
        </div>

        <div className="card p-5">
          <div className="text-muted text-sm mb-1">Account Tier</div>
          <div className="text-lg font-medium">Standard</div>
        </div>

      </div>

    </div>
  );
}
