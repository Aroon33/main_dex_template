"use client";

import { useAccount } from "wagmi";
import ConnectButton from "./ConnectButton";
import WalletStatus from "./WalletStatus";

export default function Wallet() {
  const { isConnected } = useAccount();

  return isConnected ? <WalletStatus /> : <ConnectButton />;
}
