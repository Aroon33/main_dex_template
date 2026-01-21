"use client";

import { useState } from "react";
import { useAccount } from "@/contexts/AccountContext";
import { useWallet } from "@/contexts/WalletContext";

export default function DepositPanel() {
  const [inputAmount, setInputAmount] = useState("");
  const { isConnected, connect } = useWallet();
  const { deposit, isDepositing, balance } = useAccount();

  const handleDeposit = async () => {
    try {
      await deposit(inputAmount);
      setInputAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        border: "1px solid #333",
        borderRadius: 8,
        background: "#0b1220",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>
        💰 Deposit
      </div>

      {isConnected && (
        <div style={{ fontSize: 12, marginBottom: 6, color: "#9ca3af" }}>
          Balance: {Number(balance).toFixed(2)} tUSD
        </div>
      )}

      <input
        type="text"
        placeholder="Amount (tUSD)"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 8,
          background: "#111827",
          color: "#fff",
          border: "1px solid #333",
          borderRadius: 4,
        }}
        disabled={!isConnected || isDepositing}
      />

      {!isConnected ? (
        <button
          onClick={connect}
          style={{
            width: "100%",
            padding: 8,
            background: "#2563eb",
            color: "#fff",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Connect wallet
        </button>
      ) : (
        <button
          onClick={handleDeposit}
          disabled={isDepositing}
          style={{
            width: "100%",
            padding: 8,
            background: "#2563eb",
            color: "#fff",
            borderRadius: 4,
            cursor: "pointer",
            opacity: isDepositing ? 0.6 : 1,
          }}
        >
          {isDepositing ? "Depositing..." : "Deposit"}
        </button>
      )}
    </div>
  );
}
