"use client";

import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function ConnectWallet() {
  const { connect, isPending } = useConnect();

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className="
        px-4 py-2 rounded-lg
        bg-purple-600 hover:bg-purple-700
        text-white text-sm font-medium
      "
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
