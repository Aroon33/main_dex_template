"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { BrowserProvider, Contract, ethers } from "ethers";

import { useWallet } from "@/contexts/WalletContext";
import { deposit as depositTx } from "@/lib/eth/deposit";
import { CONTRACTS } from "@/lib/eth/addresses";
import { ERC20_ABI } from "@/lib/eth/abi/ERC20";

/* ======================
   Types
====================== */

export type AccountContextType = {
  balance: string;
  isLoadingBalance: boolean;
  isDepositing: boolean;
  deposit: (amount: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
};

/* ======================
   Context
====================== */

const AccountContext = createContext<AccountContextType | null>(null);

/* ======================
   Provider
====================== */

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useWallet();

  const [balance, setBalance] = useState("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  /* ======================
     Provider helper
  ====================== */
  const getProvider = () => {
    if (!window.ethereum) return null;
    return new BrowserProvider(window.ethereum);
  };

  /* ======================
     Fetch balance
  ====================== */
  const refreshBalance = useCallback(async () => {
    if (!address) {
      setBalance("0");
      return;
    }

    const provider = getProvider();
    if (!provider) return;

    try {
      setIsLoadingBalance(true);

      const token = new Contract(
        CONTRACTS.COLLATERAL_TOKEN,
        ERC20_ABI,
        provider
      );

      const decimals: number = await token.decimals();
      const raw: bigint = await token.balanceOf(address);

      setBalance(ethers.formatUnits(raw, decimals));
    } catch (e) {
      console.error("[AccountContext] balance fetch failed:", e);
      setBalance("0");
    } finally {
      setIsLoadingBalance(false);
    }
  }, [address]);

  /* ======================
     Deposit
  ====================== */
  const deposit = async (amount: string) => {
    if (!amount || Number(amount) <= 0) return;

    try {
      setIsDepositing(true);

      const provider = getProvider();
      if (!provider) throw new Error("Wallet not found");

      const token = new Contract(
        CONTRACTS.COLLATERAL_TOKEN,
        ERC20_ABI,
        provider
      );

      const decimals: number = await token.decimals();
      const parsed = ethers.parseUnits(amount, decimals);

      await depositTx(parsed);

      // ✅ refresh after deposit
      await refreshBalance();
    } catch (e) {
      console.error("[AccountContext] deposit failed:", e);
      throw e;
    } finally {
      setIsDepositing(false);
    }
  };

  /* ======================
     Auto refresh
  ====================== */
  useEffect(() => {
    if (isConnected) {
      refreshBalance();
    } else {
      setBalance("0");
    }
  }, [isConnected, refreshBalance]);

  return (
    <AccountContext.Provider
      value={{
        balance,
        isLoadingBalance,
        isDepositing,
        deposit,
        refreshBalance,
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
