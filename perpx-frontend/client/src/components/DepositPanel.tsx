"use client";

import { useState } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { toast } from "sonner";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ERC20_ABI } from "@/lib/eth/abi/ERC20";

const MAX_UINT = (1n << 256n) - 1n;

export default function DepositPanel() {
  const [inputAmount, setInputAmount] = useState("");

  const handleDeposit = async () => {
    try {
      if (!window.ethereum) {
        toast.error("Wallet not found");
        return;
      }

      if (!inputAmount || Number(inputAmount) <= 0) {
        toast.error("Invalid amount");
        return;
      }

      toast.loading("Processing deposit...", { id: "deposit" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const user = await signer.getAddress();

      const amount = ethers.parseEther(inputAmount);

      /* ======================
         Contracts（先に宣言）
      ====================== */

      const token = new Contract(
        CONTRACTS.COLLATERAL_TOKEN,
        ERC20_ABI,
        signer
      );

      const router = new Contract(
        CONTRACTS.ROUTER,
        ["function deposit(uint256)"],
        signer
      );

      /* ======================
         Approve（必ず先）
      ====================== */

      toast.loading("Approving token...", { id: "deposit" });

      const approveTx = await token.approve(
        CONTRACTS.ROUTER,
        MAX_UINT
      );
      await approveTx.wait();

      /* ======================
         Deposit
      ====================== */

      toast.loading("Depositing...", { id: "deposit" });

      const tx = await router.deposit(amount);
      await tx.wait();

      toast.success("Deposit successful", { id: "deposit" });
      setInputAmount("");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.shortMessage || err?.message || "Deposit failed",
        { id: "deposit" }
      );
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
        💰 Deposit (Auto Approve)
      </div>

      <input
        type="number"
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
      />

      <button
        onClick={handleDeposit}
        style={{
          width: "100%",
          padding: 8,
          background: "#2563eb",
          color: "#fff",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Deposit
      </button>
    </div>
  );
}
