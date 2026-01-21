/**
 * ============================================================
 * DevTradingPanel
 * ============================================================
 *
 * Role:
 * - Admin only
 * - Verify on-chain trading behavior
 *
 * Rule:
 * - Dev use only
 * - Not used by production Trade UI
 *
 * ============================================================
 */

import { BrowserProvider } from "ethers";
import { useState } from "react";
import { useDevTradingState } from "../hooks/useDevTradingState";
import { useDevTradingWrite } from "../hooks/useDevTradingWrite";

import { ENV } from "@/lib/env";

type Props = {
  provider: BrowserProvider;
  account: string;
};

export default function DevTradingPanel({ provider, account }: Props) {
  const { state, refresh } = useDevTradingState(provider, account);
  const write = useDevTradingWrite(provider);

  const [amount, setAmount] = useState("");
  const [positionSize, setPositionSize] = useState("");
  const [positionId, setPositionId] = useState("");


  if (!state) return null;

  return (
    <div style={{ marginTop: 24, padding: 16, background: "#0b1220", borderRadius: 8 }}>
      <h3>🧪 Dev Trading Panel (Admin Only)</h3>

      {/* ===== 状態表示 ===== */}
      <pre style={{ fontSize: 12 }}>
Balance:        {state.balance.toFixed(2)}
Allowance:      {state.allowance.toFixed(2)}
Margin:         {state.margin.toFixed(2)}
ClaimablePnL:   {state.claimablePnL.toFixed(2)}

PositionSize:   {state.position.sizeUsd}
EntryPrice:     {state.position.entryPrice ?? "-"}
OraclePrice:    {state.oraclePrice ?? "-"}
UnrealizedPnL:  {state.position.unrealizedPnL.toFixed(2)}
      </pre>

      {/* ===== 入金 / 出金 ===== */}
      <h4>Deposit / Withdraw</h4>
      <input
        placeholder="Amount (USD)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <button
        onClick={async () => {
          await write.deposit(Number(amount));
          await refresh();
        }}
      >
        Deposit
      </button>

      <button
        style={{ marginLeft: 8 }}
        onClick={async () => {
          await write.withdraw(Number(amount));
          await refresh();
        }}
      >
        Withdraw
      </button>

      {/* ===== ポジション ===== */}
      <h4 style={{ marginTop: 16 }}>Position</h4>
      <input
        placeholder="Position Size (USD)"
        value={positionSize}
        onChange={(e) => setPositionSize(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <button
        onClick={async () => {
          await write.openPosition(Number(positionSize));
          await refresh();
        }}
      >
        Open Position
      </button>

      <input
        placeholder="Position ID"
        value={positionId}
        onChange={(e) => setPositionId(e.target.value)}
        style={{ width: "100%", marginTop: 8, marginBottom: 8 }}
      />

      <button
        onClick={async () => {
          await write.closePosition(Number(positionId));
          await refresh();
        }}
      >
        Close Position
      </button>

      {/* ===== PnL ===== */}
      <h4 style={{ marginTop: 16 }}>PnL</h4>
      <button
        onClick={async () => {
          await write.claimPnL();
          await refresh();
        }}
      >
        Claim PnL
      </button>
    </div>
  );
}
