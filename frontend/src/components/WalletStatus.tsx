"use client";

import { useAccount, useDisconnect } from "wagmi";

export default function WalletStatus() {
  const { address, chain, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Network */}
      <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/70">
        {chain?.name ?? "Unknown"}
      </span>

      {/* Address */}
      <span className="text-sm font-mono text-white">
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </span>

      {/* Disconnect */}
      <button
        onClick={() => disconnect()}
        className="text-xs text-red-400 hover:text-red-300"
      >
        Disconnect
      </button>
    </div>
  );
}
