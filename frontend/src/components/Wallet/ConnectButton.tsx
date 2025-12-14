"use client";

import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function ConnectButton() {
  const { connect, isLoading } = useConnect({
    connector: new InjectedConnector(),
  });

  return (
    <button
      onClick={() => connect()}
      disabled={isLoading}
      className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium"
    >
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
