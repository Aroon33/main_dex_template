"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLimitOrders } from "@/contexts/LimitOrderContext";

export default function OpenOrdersTab() {
  const { orders, cancelOrder } = useLimitOrders();

  const openOrders = orders.filter(
    (o) => o.status === "open"
  );

  if (openOrders.length === 0) {
    return (
      <div className="text-sm text-white/60">
        No open orders
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {openOrders.map((o) => (
        <Card key={o.id} className="p-3 space-y-1">
          <div className="flex justify-between">
            <div className="font-medium">
              {o.symbol} / USD
            </div>
            <div className="text-xs text-white/50">
              LIMIT
            </div>
          </div>

          <div className="text-sm text-white/70">
            {o.side.toUpperCase()} &nbsp;
            {o.sizeUsd.toLocaleString()} USD
          </div>

          <div className="text-xs text-white/60">
            Price: {o.price}
          </div>

          <div className="text-xs text-white/50">
            {new Date(o.createdAt).toLocaleString()}
          </div>

          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => cancelOrder(o.id)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
