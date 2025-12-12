"use client";

import { useState, useEffect } from "react";
import { useAccount, useWalletClient, usePublicClient } from "wagmi";
import ConfirmModal from "@/src/components/ConfirmModal";
import { LiquidityPoolABI } from "@/src/abi/liquidityPool";
import { parseEther, encodeFunctionData, stringToHex } from "viem";

export default function WalletPage() {
  const { address } = useAccount();
  const walletClient = useWalletClient();
  const publicClient = usePublicClient();

  const ASSET_KEY = stringToHex("ETH", { size: 32 });
  const LP_ADDRESS = process.env.NEXT_PUBLIC_LP_ADDRESS as `0x${string}`;

  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"deposit" | "withdraw">("deposit");

  async function reloadBalance() {
    if (!publicClient || !address) return;

    try {
      const data = await publicClient.readContract({
        address: LP_ADDRESS,
        abi: LiquidityPoolABI,
        functionName: "balances",
        args: [address, ASSET_KEY],
      });

      setBalance(Number(data) / 1e18);
    } catch (e) {
      console.error("Balance error:", e);
    }
  }

  useEffect(() => {
    reloadBalance();
  }, [publicClient, address]);

  async function execute() {
    const wallet = walletClient.data;
    if (!wallet || !address) return alert("Wallet not ready");

    try {
      if (modalAction === "deposit") {
        await wallet.sendTransaction({
          account: address,
          to: LP_ADDRESS,
          value: parseEther(amount),
          data: encodeFunctionData({
            abi: LiquidityPoolABI,
            functionName: "deposit",
            args: [address, ASSET_KEY],
          }),
        });
      } else {
        await wallet.writeContract({
          address: LP_ADDRESS,
          abi: LiquidityPoolABI,
          functionName: "withdraw",
          args: [address, ASSET_KEY, parseEther(amount)],
        });
      }

      setModalOpen(false);
      setAmount("");
      reloadBalance();
      alert("Transaction completed!");

    } catch (e) {
      console.error(e);
      alert("Transaction failed");
    }
  }

  return (
    <div className="space-y-8 w-full max-w-lg mx-auto">
      <h1 className="text-4xl font-extrabold gradient-title text-center">
        Wallet
      </h1>

      <div className="glass-card p-6 text-center">
        <p className="text-gray-300 mb-2">Balance (ETH)</p>
        <p className="text-3xl font-bold">{balance.toFixed(4)}</p>
      </div>

      <input
        type="number"
        className="input-dark"
        placeholder="0.1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
<button
  className="btn-green"
  onClick={() => {
    setModalAction("deposit");
    setModalOpen(true);
  }}
>
  Deposit
</button>
<button
  className="btn-red"
  onClick={() => {
    setModalAction("withdraw");
    setModalOpen(true);
  }}
>
  Withdraw
</button>

      </div>

      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={execute}
        title={modalAction === "deposit" ? "Deposit Confirmation" : "Withdraw Confirmation"}
        amount={amount}
      />
    </div>
  );
}
