"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { LiquidityPoolABI } from "@/src/abi/liquidityPool";
import { stringToHex } from "viem";

export default function DashboardPage() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const ASSET_KEY = stringToHex("ETH", { size: 32 });
  const LP_ADDRESS = process.env.NEXT_PUBLIC_LP_ADDRESS as `0x${string}`;
  const PERP_ADDRESS = process.env.NEXT_PUBLIC_PERP_ADDRESS as `0x${string}`;
  const ORACLE_ADDRESS = process.env.NEXT_PUBLIC_ORACLE_ADDRESS as `0x${string}`;

  const [balance, setBalance] = useState(0);
  const [position, setPosition] = useState<null | { size: number; entryPrice: number }>(null);
  const [pnl, setPnl] = useState(0);

  async function loadData() {
    if (!address || !publicClient) return;

    try {
      // Balance
      const balRaw = await publicClient.readContract({
        address: LP_ADDRESS,
        abi: LiquidityPoolABI,
        functionName: "balances",
        args: [address, ASSET_KEY],
      });
      setBalance(Number(balRaw) / 1e18);

      // Position
      const pos = (await publicClient.readContract({
        address: PERP_ADDRESS,
        abi: [
          "function getPosition(address user, bytes32 asset) view returns (int256,uint256)"
        ],
        functionName: "getPosition",
        args: [address, ASSET_KEY],
      })) as [bigint, bigint];

      const size = Number(pos[0]);
      const entryPrice = Number(pos[1]) / 1e8;

      setPosition({ size, entryPrice });

      // Oracle price
      const priceRaw = await publicClient.readContract({
        address: ORACLE_ADDRESS,
        abi: [
          "function getPrice(bytes32 asset) view returns (uint256)"
        ],
        functionName: "getPrice",
        args: [ASSET_KEY],
      });

      const price = Number(priceRaw) / 1e8;
      const pnlCalc = (price - entryPrice) * size;
      setPnl(pnlCalc);
    } catch (e) {
      console.error("Dashboard error:", e);
    }
  }

  useEffect(() => {
    loadData();
  }, [address, publicClient]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Balance */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-2">Balance</h2>
        <p className="text-3xl">{balance.toFixed(4)} ETH</p>
      </div>

      {/* Position */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-2">Position</h2>

        {position && position.size !== 0 ? (
          <>
            <p>Size: {position.size}</p>
            <p>Entry Price: ${position.entryPrice.toFixed(2)}</p>
            <p className={pnl >= 0 ? "text-green-400" : "text-red-400"}>
              PnL: {pnl.toFixed(4)} ETH
            </p>
          </>
        ) : (
          <p className="text-gray-400">No Position</p>
        )}
      </div>
    </div>
  );
}
