"use client";

import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function ConnectButton() {
  const { connect, isPending } = useConnect();

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-50"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
