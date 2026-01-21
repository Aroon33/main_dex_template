"use client";

/**
 * ============================================================
 * OpenOrdersTab
 * ============================================================
 *
 * - 未約定オーダー表示
 * - SSOT: AccountContext
 *
 * ============================================================
 */

import { Card } from "@/components/ui/card";
import { useAccount } from "@/contexts/AccountContext";

export default function OpenOrdersTab() {
  const { address, orders, isLoading } = useAccount();

  if (!address) {
    return <div className="text-sm text-white/60">Wallet not connected</div>;
  }

  if (isLoading) {
    return <div className="text-sm text-white/60">Loading orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return <div className="text-sm text-white/60">No open orders</div>;
  }

  return (
    <div className="space-y-2">
      {orders.map((o) => (
        <Card key={o.id} className="p-3">
          <div className="font-medium">Order #{o.id}</div>
          <div className="text-xs text-white/60">
            Position ID: {o.positionId}
          </div>
        </Card>
      ))}
    </div>
  );
}
