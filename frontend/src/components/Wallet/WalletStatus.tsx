"use client";

import { useAccount, useChainId, useDisconnect } from "wagmi";

export default function WalletStatus() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  if (!address) return null;

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="flex items-center gap-2">
      <div className="px-3 py-1 rounded-lg bg-white/10 text-xs text-white">
        {shortAddress}
      </div>

      <div className="px-2 py-1 rounded-lg bg-white/5 text-xs text-white/70">
        Chain {chainId}
      </div>

      <button
        onClick={() => disconnect()}
        className="text-xs text-white/60 hover:text-red-400"
      >
        Disconnect
      </button>
    </div>
  );
}
