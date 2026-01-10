"use client";

/**
 * ============================================================
 * AccountContext (SINGLE SOURCE OF TRUTH)
 * ============================================================
 *
 * - wallet address / provider
 * - balances / positions / trades
 * - Router event を元に履歴を生成
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
import { ORACLE_ABI } from "@/lib/eth/abi/Oracle";
import { deposit as depositTx } from "@/lib/eth/deposit";
import { getPositionCloseEvents } from "@/lib/eth/events/positionClose";

/* ======================
   Types
====================== */

export type Position = {
  id: number;
  pair: string;
  size: number;          // signed, raw (1e18)
  entryPrice: number;    // USD
  isOpen: boolean;
};

export type Trade = {
  id: number;            // positionId
  symbol: string;
  side: "buy" | "sell";

  sizeUsd: number;       // 決済サイズ（USD）
  entryPrice: number;    // Entry price
  exitPrice: number;     // Exit price

  pnl: number;           // Realized PnL (USD)
  timestamp: number;
};

export type Order = {
  id: number;
  positionId: number;
};

export type AccountContextType = {
  address?: string;
  provider?: BrowserProvider;

  collateralBalance: number;
  marginBalance: number;

  positions: Position[];
  trades: Trade[];
  orders: Order[];

  isLoading: boolean;
  isDepositing: boolean;

  refreshAll: () => Promise<void>;
  deposit: (amount: string) => Promise<void>;
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
  const address: string | undefined = wallet.address ?? undefined;
  const isConnected = wallet.isConnected;

  const [provider, setProvider] = useState<BrowserProvider | undefined>();

  const [collateralBalance, setCollateralBalance] = useState(0);
  const [marginBalance, setMarginBalance] = useState(0);

  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

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
     Refresh balances & OPEN positions
  ====================== */
  const refreshAll = useCallback(async () => {
    if (!address || !provider) {
      setCollateralBalance(0);
      setMarginBalance(0);
      setPositions([]);
      setOrders([]);
      return;
    }

    try {
      setIsLoading(true);

      /* ===== Collateral ===== */
      const token = new Contract(
        CONTRACTS.COLLATERAL_TOKEN,
        ERC20_ABI,
        provider
      );

      const decimals = await token.decimals();
      const rawToken = await token.balanceOf(address);
      setCollateralBalance(
        Number(ethers.formatUnits(rawToken, decimals))
      );

      /* ===== Perpetual ===== */
      const perp = new Contract(
        CONTRACTS.PERPETUAL_TRADING,
        [
          "function getMargin(address) view returns (uint256)",
          "function getUserPositionIds(address) view returns (uint256[])",
          "function getPosition(address,uint256) view returns (bytes32,int256,uint256,uint256,bool)",
        ],
        provider
      );

      const rawMargin = await perp.getMargin(address);
      setMarginBalance(Number(rawMargin) / 1e18);

      const ids: bigint[] = await perp.getUserPositionIds(address);

      const openPositions: Position[] = [];
      for (const id of ids) {
        const [pair, size, entryPrice, , isOpen] =
          await perp.getPosition(address, id);

        if (!isOpen) continue;

        openPositions.push({
          id: Number(id),
          pair: ethers.decodeBytes32String(pair),
          size: Number(size),
          entryPrice: Number(entryPrice) / 1e18,
          isOpen,
        });
      }

      setPositions(openPositions);
    } catch (e) {
      console.error("[AccountContext] refreshAll failed:", e);
    } finally {
      setIsLoading(false);
    }
  }, [address, provider]);

  /* ======================
   Trade history (Router PositionClosed event)
====================== */
useEffect(() => {
  if (!address) {
    setTrades([]);
    return;
  }

  let cancelled = false;

  (async () => {
    try {
      const events = await getPositionCloseEvents(address);
      if (cancelled) return;

      const result: Trade[] = events.map((e) => ({
        id: Number(e.positionId),
        symbol: ethers.decodeBytes32String(e.pair),

        // LONG を閉じたら SELL
        side: e.size > 0n ? "sell" : "buy",

        sizeUsd: Number(
          e.size > 0n ? e.size : -e.size
        ) / 1e18,

        entryPrice: Number(e.entryPrice) / 1e18,
        exitPrice: Number(e.exitPrice) / 1e18,

        pnl: Number(e.pnl) / 1e18,
        timestamp: Number(e.timestamp) * 1000,
      }));

      if (!cancelled) {
        setTrades(result);
      }
    } catch (e) {
      console.error(
        "[AccountContext] load trade history failed:",
        e
      );
    }
  })();

  return () => {
    cancelled = true;
  };
}, [address]);


  /* ======================
     Deposit
  ====================== */
  const deposit = async (amount: string) => {
    if (!amount || Number(amount) <= 0) return;
    if (!provider) throw new Error("Provider not ready");

    try {
      setIsDepositing(true);

      const token = new Contract(
        CONTRACTS.COLLATERAL_TOKEN,
        ERC20_ABI,
        provider
      );

      const decimals = await token.decimals();
      const parsed = ethers.parseUnits(amount, decimals);

      await depositTx(parsed);
      await refreshAll();
    } finally {
      setIsDepositing(false);
    }
  };

  /* ======================
     Auto refresh
  ====================== */
  useEffect(() => {
    if (isConnected) {
      refreshAll();
    } else {
      setCollateralBalance(0);
      setMarginBalance(0);
      setPositions([]);
      setTrades([]);
      setOrders([]);
    }
  }, [isConnected, refreshAll]);

  return (
    <AccountContext.Provider
      value={{
        address,
        provider,
        collateralBalance,
        marginBalance,
        positions,
        trades,
        orders,
        isLoading,
        isDepositing,
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
