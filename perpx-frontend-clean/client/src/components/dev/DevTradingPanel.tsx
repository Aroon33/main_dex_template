import { useState, useEffect } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { toast } from "sonner";

const PAIR = ethers.encodeBytes32String("tUSD");

type Props = {
  provider: BrowserProvider;
  account: string;
};

export default function DevTradingPanel({ provider, account }: Props) {
  /* ======================
     State
  ====================== */
  const [oraclePrice, setOraclePrice] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [margin, setMargin] = useState(0);
  const [claimablePnL, setClaimablePnL] = useState(0);

  const [positionSize, setPositionSize] = useState(0);
  const [entryPrice, setEntryPrice] = useState<number | null>(null);
  const [unrealizedPnL, setUnrealizedPnL] = useState(0);

  const [inputAmount, setInputAmount] = useState("");
  const [newPrice, setNewPrice] = useState("");

  /* ======================
     Contracts
  ====================== */
  const oracle = new Contract(
    CONTRACTS.PRICE_ORACLE,
    [
      "function getPrice(bytes32) view returns (uint256)",
      "function setPrice(bytes32,uint256)",
    ],
    provider
  );

  const token = new Contract(
    CONTRACTS.COLLATERAL_TOKEN,
    [
      "function balanceOf(address) view returns (uint256)",
      "function allowance(address,address) view returns (uint256)",
      "function approve(address,uint256)",
    ],
    provider
  );

  const perp = new Contract(
    CONTRACTS.PERPETUAL_TRADING,
    [
      "function getMargin(address) view returns (uint256)",
      "function getClaimablePnL(address) view returns (int256)",
      "function getUserPositionIds(address) view returns (uint256[])",
      "function getPosition(address,uint256) view returns (bytes32,int256,uint256,uint256,bool)",
      "function claimPnL(address)",
    ],
    provider
  );

  const router = new Contract(
    CONTRACTS.ROUTER,
    [
      "function deposit(uint256)",
      "function withdraw(uint256)",
      "function openPosition(bytes32,int256)",
      "function closePosition(uint256)",
      "function closePositionPartial(uint256,int256)",
    ],
    provider
  );

  /* ======================
     Refresh
  ====================== */
  const refresh = async () => {
    const signer = await provider.getSigner();
    const user = await signer.getAddress();

    const p = Number(await oracle.getPrice(PAIR)) / 1e8;
    setOraclePrice(p);

    setBalance(Number(await token.balanceOf(user)) / 1e18);
    setAllowance(Number(await token.allowance(user, CONTRACTS.ROUTER)) / 1e18);
    setMargin(Number(await perp.getMargin(user)) / 1e18);
    setClaimablePnL(Number(await perp.getClaimablePnL(user)) / 1e18);

    const ids = await perp.getUserPositionIds(user);
    if (ids.length > 0) {
      const pos = await perp.getPosition(user, ids[0]);
      const sizeUsd = Number(pos[1]);
      const entry = Number(pos[2]) / 1e8;

      setPositionSize(sizeUsd);
      setEntryPrice(entry);
      setUnrealizedPnL((sizeUsd * (p - entry)) / entry);
    } else {
      setPositionSize(0);
      setEntryPrice(null);
      setUnrealizedPnL(0);
    }
  };

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  /* ======================
     UI
  ====================== */
  return (
    <div style={{ marginTop: 24, padding: 16, background: "#0b1220", borderRadius: 8 }}>
      <h3>🧪 Dev Trading Panel</h3>

      <pre style={{ fontSize: 12 }}>
Balance: {balance.toFixed(2)}
Allowance: {allowance.toFixed(2)}
Margin: {margin.toFixed(2)}
ClaimablePnL: {claimablePnL.toFixed(2)}
PositionSize: {positionSize}
EntryPrice: {entryPrice ?? "-"}
OraclePrice: {oraclePrice ?? "-"}
UnrealizedPnL: {unrealizedPnL.toFixed(2)}
      </pre>

      <input
        placeholder="Amount (USD)"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <input
        placeholder="New Oracle Price (USD)"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />
    </div>
  );
}
