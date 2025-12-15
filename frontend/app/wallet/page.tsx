"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import RouterArtifact from "@/src/contracts/Router.json";

export default function WalletPage() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [amount, setAmount] = useState("0.01");
  const [loading, setLoading] = useState(false);

  const routerAddress = process.env.NEXT_PUBLIC_ROUTER_ADDRESS as string;

  const deposit = async () => {
    try {
      if (!isConnected || !walletClient) {
        alert("Wallet not connected");
        return;
      }

      setLoading(true);

      const provider = new ethers.BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();

      const router = new ethers.Contract(
        routerAddress,
        RouterArtifact.abi,
        signer
      );

      const tx = await router.deposit(
        ethers.encodeBytes32String("ETH"),
        {
          value: ethers.parseEther(amount),
        }
      );

      await tx.wait();
      alert("Deposit successful");

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async () => {
    alert("Withdraw is next step (not wired yet)");
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="card p-6">
        <h1 className="text-3xl font-semibold">Wallet</h1>
        <p className="text-muted mt-1">
          Manage your balances and funds.
        </p>
      </div>

      {/* Balances (still dummy for now) */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="text-sm text-muted mb-1">Total Balance</div>
          <div className="text-2xl font-semibold">$15,230.00</div>
        </div>

        <div className="card p-6">
          <div className="text-sm text-muted mb-1">Available Balance</div>
          <div className="text-2xl font-semibold">$6,780.45</div>
        </div>
      </div>

      {/* Actions */}
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Actions</h2>

        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-black border border-white/10"
          placeholder="ETH amount"
        />

        <div className="flex gap-4">
          <button
            onClick={deposit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Processing..." : "Deposit"}
          </button>

          <button
            onClick={withdraw}
            className="btn-ghost"
          >
            Withdraw
          </button>
        </div>
      </div>

    </div>
  );
}
