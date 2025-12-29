"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

type Position = {
  id: string;
  symbol: string;
  openedAt: number;
};

type Trade = {
  id: string;
  symbol: string;
  side: string;
  pnl: number;
  timestamp: number;
};

type Order = {
  id: string;
  positionId: number;
};

type Props = {
  positions: Position[];
  tradeHistory: Trade[];
  orders: Order[];
  orderBookAsks: any[];
  orderBookBids: any[];
};

export default function TradeBottomTabs({
  positions,
  tradeHistory,
  orders,
  orderBookAsks,
  orderBookBids,
}: Props) {
  return (
    <Tabs defaultValue="positions" className="w-full">
      <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0">
        <TabsTrigger value="positions">Positions</TabsTrigger>
        <TabsTrigger value="trade-history">Trade History</TabsTrigger>
        <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
        <TabsTrigger value="order-book">Order Book</TabsTrigger>
      </TabsList>

      {/* ================= Positions ================= */}
      <TabsContent value="positions" className="p-4 space-y-2">
        {positions.length === 0 ? (
          <div className="text-sm text-white/60">No open positions</div>
        ) : (
          positions.map((p) => (
            <Card key={p.id} className="p-3">
              <div className="font-medium">{p.symbol}</div>
              <div className="text-xs text-white/60">
                Opened: {new Date(p.openedAt).toLocaleString()}
              </div>
            </Card>
          ))
        )}
      </TabsContent>

      {/* ================= Trade History ================= */}
      <TabsContent value="trade-history" className="p-4 space-y-2">
        {tradeHistory.length === 0 ? (
          <div className="text-sm text-white/60">No trade history</div>
        ) : (
          tradeHistory.map((t) => (
            <Card key={t.id} className="p-3">
              <div className="flex justify-between">
                <div>
                  {t.symbol} · {t.side}
                </div>
                <div className={t.pnl >= 0 ? "text-green-500" : "text-red-500"}>
                  {t.pnl.toFixed(2)}
                </div>
              </div>
              <div className="text-xs text-white/60">
                {new Date(t.timestamp).toLocaleString()}
              </div>
            </Card>
          ))
        )}
      </TabsContent>

      {/* ================= Open Orders ================= */}
      <TabsContent value="open-orders" className="p-4 space-y-2">
        {orders.length === 0 ? (
          <div className="text-sm text-white/60">No open orders</div>
        ) : (
          orders.map((o) => (
            <Card key={o.id} className="p-3">
              <div>Close Requested</div>
              <div className="text-xs">
                Position #{o.positionId}
              </div>
            </Card>
          ))
        )}
      </TabsContent>

      {/* ================= Order Book ================= */}
      <TabsContent value="order-book" className="p-3">
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-2 text-xs text-white/60 mb-2">
            <div>Price (USDT)</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Total</div>
          </div>

          {orderBookAsks.map((ask, i) => (
            <div key={`ask-${i}`} className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-red-500">{ask.price}</div>
              <div className="text-white/60 text-right">{ask.size}</div>
              <div className="text-white/60 text-right">{ask.sum}</div>
            </div>
          ))}

          <div className="text-lg font-bold text-white my-2">
            111,062.6 ↓
          </div>

          {orderBookBids.map((bid, i) => (
            <div key={`bid-${i}`} className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-green-500">{bid.price}</div>
              <div className="text-white/60 text-right">{bid.size}</div>
              <div className="text-white/60 text-right">{bid.sum}</div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
