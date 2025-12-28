"use client";

import { useState, useEffect } from "react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { toast } from "sonner";

const PAIR = ethers.encodeBytes32String("tUSD");
const DEV_UPDATER_ADDRESS = "0xf79Aa1eF9b96ad162fcD4b2C6401DE1ccc649641";

type Props = {
  provider: BrowserProvider;
  account: string;
};

export default function DevTradingPanel({ provider, account }: Props) {
  /* ======================
     Guard (Dev only)
  ====================== */
  if (!account || account.toLowerCase() !== DEV_UPDATER_ADDRESS.toLowerCase()) {
    return null;
  }

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
     Refresh state
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
      setUnrealizedPnL(sizeUsd * (p - entry) / entry);
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
   Actions (FIXED for TS)
====================== */

const withSigner = async () => provider.getSigner();

const approve = async () => {
  const signer = await withSigner();
  const t = token.connect(signer) as any;

  await (await t.approve(
    CONTRACTS.ROUTER,
    ethers.parseEther("1000000")
  )).wait();

  toast.success("Approve OK");
  refresh();
};

const deposit = async () => {
  const signer = await withSigner();
  const r = router.connect(signer) as any;

  await (await r.deposit(
    ethers.parseEther(inputAmount)
  )).wait();

  toast.success("Deposit OK");
  refresh();
};

const withdraw = async () => {
  const signer = await withSigner();
  const r = router.connect(signer) as any;

  await (await r.withdraw(
    ethers.parseEther(inputAmount)
  )).wait();

  toast.success("Withdraw OK");
  refresh();
};

const openPosition = async () => {
  const signer = await withSigner();
  const r = router.connect(signer) as any;

  await (await r.openPosition(
    PAIR,
    BigInt(inputAmount)
  )).wait();

  toast.success("Open Position OK");
  refresh();
};

const closePosition = async () => {
  const signer = await withSigner();
  const r = router.connect(signer) as any;

  await (await r.closePosition(0)).wait();

  toast.success("Close Position OK");
  refresh();
};

const partialClose = async () => {
  const signer = await withSigner();
  const r = router.connect(signer) as any;

  await (await r.closePositionPartial(
    0,
    BigInt(inputAmount)
  )).wait();

  toast.success("Partial Close OK");
  refresh();
};

const claim = async () => {
  const signer = await withSigner();
  const p = perp.connect(signer) as any;

  await (await p.claimPnL(account)).wait();

  toast.success("Claim OK");
  refresh();
};

const updatePrice = async () => {
  const signer = await withSigner();
  const o = oracle.connect(signer) as any;

  const price = BigInt(Math.floor(Number(newPrice) * 1e8));

  await (await o.setPrice(PAIR, price)).wait();

  toast.success("Price Updated");
  refresh();
};


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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        <button onClick={approve}>Approve</button>
        <button onClick={deposit}>Deposit</button>
        <button onClick={withdraw}>Withdraw</button>
        <button onClick={openPosition}>Open</button>
        <button onClick={closePosition}>Close</button>
        <button onClick={partialClose}>Partial Close</button>
        <button onClick={claim}>Claim</button>
        <button onClick={updatePrice} style={{ background: "#f59e0b" }}>
          Set Price
        </button>
      </div>
    </div>
  );
}
