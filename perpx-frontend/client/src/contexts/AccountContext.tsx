"use client";

/**
 * ============================================================
 * AccountContext (SINGLE SOURCE OF TRUTH – FINAL / PoC)
 * ============================================================
 *
 * Available Balance (PoC definition):
 *   Available = traderMargin - Σ(|position.size| / leverage)
 *
 * IMPORTANT:
 *
 * - Wallet ERC20 balance is shown ONLY for Deposit UI
 * - Wallet ERC20 balance is NOT used for Withdraw
 *
 * ============================================================
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { BrowserProvider, Contract, ethers } from "ethers";

import { useWallet } from "@/contexts/WalletContext";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ERC20_ABI } from "@/lib/eth/abi/ERC20";
import { getPositionCloseEvents } from "@/lib/eth/events/positionClose";
import { deposit as depositTx } from "@/lib/eth/deposit";


import { withdrawTx } from "@/lib/eth/withdraw";


/* ======================
   Constants (PoC)
====================== */

const LEVERAGE = 10;

/* ======================
   Types
====================== */

export type Position = {
  id: number;
  pair: string;
  size: number;        // signed USD notional
  entryPrice: number;  // USD
  isOpen: boolean;
};

export type Trade = {
  id: number;
  symbol: string;
  side: "buy" | "sell";
  sizeUsd: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  timestamp: number;
};

export type AccountContextType = {
  address?: string;
  provider?: BrowserProvider;

  /** trader margin (deposit total) */
  marginBalance: number;

  /** marginBalance - usedMargin */
  availableBalance: number;
  walletTokenBalance: number;


  positions: Position[];
  trades: Trade[];

  isLoading: boolean;
  isDepositing: boolean;
  isWithdrawing: boolean;

  refreshAll: () => Promise<void>;
  deposit: (amount: string) => Promise<void>;
  withdraw: (amount: string) => Promise<void>;
};

/* ======================
   Context
====================== */

const AccountContext = createContext<AccountContextType | null>(null);

/* ======================
   Provider
====================== */

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const address = wallet.address ?? undefined;
  const isConnected = wallet.isConnected;

  const [provider, setProvider] = useState<BrowserProvider | undefined>();

  const [walletTokenBalance, setWalletTokenBalance] = useState(0);


  const [marginBalance, setMarginBalance] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  const [isWithdrawing, setIsWithdrawing] = useState(false);


  /* ======================
     Provider init
  ====================== */
  useEffect(() => {
    if (!window.ethereum) {
      setProvider(undefined);
      return;
    }
    setProvider(new BrowserProvider(window.ethereum));
  }, []);

  /* ======================
     Refresh ALL
  ====================== */
  const refreshAll = useCallback(async () => {
    if (!address || !provider) {
      setMarginBalance(0);
      setAvailableBalance(0);
      setPositions([]);
      return;
    }

    try {
      setIsLoading(true);

     /* ===== ERC20 wallet balance ===== */
const token = new Contract(
  CONTRACTS.COLLATERAL_TOKEN,
  ERC20_ABI,
  provider
);

const decimals = await token.decimals();
const rawBalance = await token.balanceOf(address);
const balance = Number(ethers.formatUnits(rawBalance, decimals));

setWalletTokenBalance(balance);
 

      const perp = new Contract(
        CONTRACTS.PERPETUAL_TRADING,
        [
          "function getMargin(address) view returns (uint256)",
          "function getUserPositionIds(address) view returns (uint256[])",
          "function getPosition(address,uint256) view returns (bytes32,int256,uint256,uint256,bool)",
        ],
        provider
      );

      /* ===== trader margin ===== */
      const rawMargin = await perp.getMargin(address);
      const margin = Number(rawMargin) / 1e18;
      setMarginBalance(margin);

      /* ===== positions & used margin (size based) ===== */
      const ids: bigint[] = await perp.getUserPositionIds(address);

      const open: Position[] = [];
      let usedMargin = 0;

      for (const id of ids) {
        const [pair, size, entryPrice, , isOpen] =
          await perp.getPosition(address, id);

        if (!isOpen) continue;

        const sizeUsd = Math.abs(Number(size)) / 1e18;
        usedMargin += sizeUsd / LEVERAGE;

        open.push({
          id: Number(id),
          pair: ethers.decodeBytes32String(pair),
          size: Number(size),
          entryPrice: Number(entryPrice) / 1e18,
          isOpen: true,
        });
      }

      setPositions(open);

      /* ===== Available (clamped) ===== */
      setAvailableBalance(Math.max(margin - usedMargin, 0));
    } catch (e) {
      console.error("[AccountContext] refreshAll failed:", e);
    } finally {
      setIsLoading(false);
    }
  }, [address, provider]);

  /* ======================
     Trade history
  ====================== */
  useEffect(() => {
    if (!address || !provider) {
      setTrades([]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const events = await getPositionCloseEvents(address, provider);
        if (cancelled) return;

        const result: Trade[] = events.map((e) => ({
          id: Number(e.positionId),
          symbol: ethers.decodeBytes32String(e.pair),
          side: e.size > 0n ? "sell" : "buy",
          sizeUsd: Number(e.size > 0n ? e.size : -e.size) / 1e18,
          entryPrice: Number(e.entryPrice) / 1e18,
          exitPrice: Number(e.exitPrice) / 1e18,
          pnl: Number(e.pnl) / 1e18,
          timestamp: Number(e.timestamp) * 1000,
        }));

        setTrades(result);
      } catch (e) {
        console.error("[AccountContext] trade history failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [address, provider]);

  /* ======================
     Deposit
  ====================== */
  const deposit = async (amount: string) => {
    if (!amount || Number(amount) <= 0) return;
    if (!window.ethereum) throw new Error("Wallet not found");

    try {
      setIsDepositing(true);

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const token = new Contract(
        CONTRACTS.COLLATERAL_TOKEN,
        ERC20_ABI,
        signer
      );

      const decimals = await token.decimals();
      const parsed = ethers.parseUnits(amount, decimals);

      await depositTx(signer, parsed);
      await refreshAll();
    } finally {
      setIsDepositing(false);
    }
  };

  /* ======================
     withdraw
  ====================== */

const withdraw = async (amount: string) => {
  if (!amount || Number(amount) <= 0) return;
  if (!window.ethereum) throw new Error("Wallet not found");
  if (!address) return;

  try {
    setIsWithdrawing(true);

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // collateral is 18 decimals
    const parsed = ethers.parseUnits(amount, 18);

    await withdrawTx(signer, parsed);
    await refreshAll();
  } finally {
    setIsWithdrawing(false);
  }
};


  /* ======================
     Auto refresh
  ====================== */
  useEffect(() => {
    if (isConnected) {
      refreshAll();
    } else {
      setMarginBalance(0);
      setAvailableBalance(0);
      setPositions([]);
      setTrades([]);
    }
  }, [isConnected, refreshAll]);

  return (
    <AccountContext.Provider
      value={{
        address,
        provider,
        marginBalance,
        availableBalance,
        walletTokenBalance,
        positions,
        trades,
        isLoading,
        isDepositing,
        isWithdrawing,
        withdraw,
        refreshAll,
        deposit,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

/* ======================
   Hook
====================== */

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error("useAccount must be used within AccountProvider");
  }
  return ctx;
}
