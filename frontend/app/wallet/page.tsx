export default function WalletPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card p-6">
        <h1 className="text-3xl font-semibold">Wallet</h1>
        <p className="text-muted mt-1">
          Manage your balances and funds.
        </p>
      </div>

      {/* Balances */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="text-sm text-muted mb-1">Total Balance</div>
          <div className="text-2xl font-semibold">$15,230.00</div>
        </div>

        <div className="card p-6">
          <div className="text-sm text-muted mb-1">Available Balance</div>
          <div className="text-2xl font-semibold">$6,780.45</div>
        </div>
      </div>

      {/* Actions */}
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Actions</h2>

        <div className="flex gap-4">
          <button className="btn-primary">
            Deposit
          </button>

          <button className="btn-ghost">
            Withdraw
          </button>
        </div>
      </div>

    </div>
  );
}
