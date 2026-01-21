
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

/* ============================================================
   Global (MetaMask)
============================================================ */

declare global {
  interface Window {
    ethereum?: any;
  }
}

/* ============================================================
   Types
============================================================ */

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

/* ============================================================
   Context
============================================================ */

const WalletContext = createContext<WalletContextType | undefined>(undefined);

/* ============================================================
   Provider
============================================================ */

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  /* ============================================================
     Restore connection (eth_accounts)
  ============================================================ */
  useEffect(() => {
    if (!window.ethereum) return;

    (async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (e) {
        console.error("[WalletContext] restore failed:", e);
      }
    })();
  }, []);

  /* ============================================================
     Connect (user action only)
  ============================================================ */
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (e) {
      console.error("[WalletContext] connect failed:", e);
    }
  }, []);

  /* ============================================================
     Disconnect (local only)
  ============================================================ */
  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

/* ============================================================
   Hook
============================================================ */

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
