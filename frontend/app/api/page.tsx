"use client";

export default function ApiPage() {
  return (
    <div className="min-h-screen px-6 py-24 flex justify-center">
      <div className="w-full max-w-4xl space-y-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          API
        </h1>
        <p className="text-white/60 text-lg">
          Programmatic access to PerpX market data and protocol state.
        </p>

        <div className="glass-card p-6 rounded-2xl">
          <p className="text-white/70">
            REST and WebSocket API documentation will be published here.
          </p>
        </div>
      </div>
    </div>
  );
}
