"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Wallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status } = useConnect();
  const { disconnect } = useDisconnect();

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const defaultConnector = connectors[0];

  return (
    <div className="flex items-center">
      {!isConnected ? (
        <button
          onClick={() => defaultConnector && connect({ connector: defaultConnector })}
          className="
            px-4 py-2 rounded-lg
            bg-gradient-to-r from-purple-500 to-indigo-600
            hover:opacity-90 active:scale-95
            transition shadow-lg text-white font-semibold
            whitespace-nowrap
          "
        >
          {status === "pending" ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div
            className="
              px-4 py-2 rounded-lg 
              bg-black/40 backdrop-blur-xl 
              border border-white/10 
              font-mono text-sm shadow-lg
            "
          >
            {shortAddress}
          </div>

          <button
            onClick={() => disconnect()}
            className="
              p-2 rounded-lg 
              bg-red-600 hover:bg-red-700 active:scale-95
              transition shadow-md text-white
            "
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
