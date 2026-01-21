/**
 * ============================================================
 * AdminLayout (wouter)
 * ============================================================
 *
 * 目的:
 * - Admin 共通ガード
 * - Wallet 接続
 * - Admin 権限チェック
 * - Admin ナビゲーション
 *
 * ============================================================
 */

import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { useRuntimeConfig } from "@/hooks/useRuntimeConfig";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const { address, isConnected, connect } = useWallet();
  const { config, loading, error } = useRuntimeConfig();

  if (loading) return <div className="p-6">Loading config…</div>;
  if (error || !config)
    return <div className="p-6 text-red-500">Config error</div>;

  if (!isConnected) {
    return (
      <div className="p-6">
        <Button onClick={connect}>Connect Wallet</Button>
      </div>
    );
  }

  const isAdmin =
    address?.toLowerCase() ===
    config.dev.userAddress.toLowerCase();

  if (!isAdmin) {
    return <div className="p-6 text-red-500">Not authorized</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <nav className="flex gap-4 text-sm border-b border-white/10 pb-2">
        <Link href="/admin/pairs">Pairs</Link>
        <Link href="/admin/pricing">Pricing</Link>
        <Link href="/admin/feeds">Feeds</Link>
      </nav>

      {children}
    </div>
  );
}
