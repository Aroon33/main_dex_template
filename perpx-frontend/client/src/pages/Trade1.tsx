import { useEffect } from "react";
import { BrowserProvider } from "ethers";

// Context（すでに App で wrap されている前提）
import { useWallet } from "@/contexts/WalletContext";
import { useAccount } from "@/contexts/AccountContext";

// UI / Components（trade1 が元々使っていたもの）
import OrderForm from "@/components/trade/OrderForm";
import Positions from "@/components/trade/Positions";
import OrderBook from "@/components/trade/OrderBook";
import TradeHistory from "@/components/trade/TradeHistory";

export default function Trade1() {
  /* =========================
     Wallet / Account
  ========================= */
  const { provider } = useWallet();
  const { address } = useAccount();

  /* =========================
     Guard（超重要）
     → provider / address が無い状態で
        下の UI を描画しない
  ========================= */
  if (!provider || !address) {
    return (
      <div className="flex items-center justify-center h-full text-white/60">
        Connecting wallet...
      </div>
    );
  }

  /* =========================
     Debug（必要なら）
  ========================= */
  useEffect(() => {
    console.log("[Trade1] provider:", provider);
    console.log("[Trade1] address:", address);
  }, [provider, address]);

  /* =========================
     Render
     ※ mobile / desktop を
       CSS で分けるが
       DOMは1系統だけ
  ========================= */
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ===== Order Form (Buy / Sell) ===== */}
      <div className="p-4 border-b border-white/10">
        <OrderForm
          provider={provider as BrowserProvider}
          address={address}
        />
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== Order Book ===== */}
        <div className="hidden lg:block w-64 border-r border-white/10">
          <OrderBook provider={provider as BrowserProvider} />
        </div>

        {/* ===== Positions / History ===== */}
        <div className="flex-1 overflow-y-auto">
          <Positions
            provider={provider as BrowserProvider}
            address={address}
          />

          <TradeHistory
            provider={provider as BrowserProvider}
            address={address}
          />
        </div>

      </div>
    </div>
  );
}
