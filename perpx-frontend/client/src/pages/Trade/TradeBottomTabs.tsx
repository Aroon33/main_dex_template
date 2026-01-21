"use client";

/**
 * ============================================================
 * TradeBottomTabs
 * ============================================================
 *
 * - props は一切使わない
 * - AccountContext を SINGLE SOURCE とする
 * - 各 Tab は専用コンポーネントに委譲
 *
 * IMPORTANT:
 * - タブ切替では refreshAll() を呼ばない
 * - on-chain / off-chain の SSOT を分離する
 *
 * ============================================================
 */

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import PositionsTab from "./tabs/PositionsTab";
import TradeHistoryTab from "./tabs/TradeHistoryTab";
import OpenOrdersTab from "./tabs/OpenOrdersTab";
import OrderBookTab from "./tabs/OrderBookTab";

export default function TradeBottomTabs() {
  return (
    <Tabs
      defaultValue="positions"
      className="w-full"
    >
      <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0">
        <TabsTrigger value="positions">Positions</TabsTrigger>
        <TabsTrigger value="trade-history">Trade History</TabsTrigger>
        <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
        <TabsTrigger value="order-book">Order Book</TabsTrigger>
      </TabsList>

      <TabsContent value="positions" className="p-4">
        <PositionsTab />
      </TabsContent>

      <TabsContent value="trade-history" className="p-4">
        <TradeHistoryTab />
      </TabsContent>

      <TabsContent value="open-orders" className="p-4">
        <OpenOrdersTab />
      </TabsContent>

      <TabsContent value="order-book" className="p-4">
        <OrderBookTab />
      </TabsContent>
    </Tabs>
  );
}
