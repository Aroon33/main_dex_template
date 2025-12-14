export default function DocsPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Documentation</h1>
        <p className="text-muted">
          Learn how PerpX works and how to integrate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="card p-5">
          <h2 className="font-medium mb-1">Getting Started</h2>
          <p className="text-muted text-sm">
            Wallet connection, basic trading flow.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="font-medium mb-1">Trading Engine</h2>
          <p className="text-muted text-sm">
            How perpetual orders and funding work.
          </p>
        </div>

      </div>

    </div>
  );
}
