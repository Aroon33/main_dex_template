export default function BlogPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Blog</h1>
        <p className="text-muted">
          Updates, announcements, and research.
        </p>
      </div>

      <div className="space-y-4">

        <div className="card p-5">
          <h2 className="font-medium mb-1">PerpX Launch Update</h2>
          <p className="text-muted text-sm">
            Introducing our first perpetual trading release.
          </p>
        </div>

        <div className="card p-5">
          <h2 className="font-medium mb-1">Liquidity Architecture</h2>
          <p className="text-muted text-sm">
            How PerpX ensures deep liquidity.
          </p>
        </div>

      </div>

    </div>
  );
}
