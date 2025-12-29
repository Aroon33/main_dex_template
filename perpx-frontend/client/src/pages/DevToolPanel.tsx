// src/pages/DevToolPanel.tsx
import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import DevTradingPanel from "@/components/dev/DevTradingPanel";

export default function DevToolPanel() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (!window.ethereum) return;

    const init = async () => {
      const p = new BrowserProvider(window.ethereum);
      const signer = await p.getSigner();
      setProvider(p);
      setAccount(await signer.getAddress());
    };

    init();
  }, []);

  if (!provider || !account) {
    return <div>Wallet not connected</div>;
  }

  return <DevTradingPanel provider={provider} account={account} />;
}
