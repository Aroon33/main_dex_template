"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { BrowserProvider } from "ethers";
import { useWallet } from "@/contexts/WalletContext";

type TradeReadContextType = {
  address?: string;
  provider?: BrowserProvider;
};

const TradeReadContext = createContext<TradeReadContextType | null>(null);

export function TradeReadProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useWallet();

  const provider = useMemo(() => {
    if (!isConnected || typeof window === "undefined") return undefined;
    if (!(window as any).ethereum) return undefined;
    return new BrowserProvider((window as any).ethereum);
  }, [isConnected]);

  return (
    <TradeReadContext.Provider
      value={{
        address: isConnected ? address : undefined,
        provider,
      }}
    >
      {children}
    </TradeReadContext.Provider>
  );
}

export function useTradeRead() {
  const ctx = useContext(TradeReadContext);
  if (!ctx) {
    throw new Error("useTradeRead must be used within TradeReadProvider");
  }
  return ctx;
}
