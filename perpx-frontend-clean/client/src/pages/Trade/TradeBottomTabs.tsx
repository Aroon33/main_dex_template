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
 * ============================================================
 */

"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useAccount } from "@/contexts/AccountContext";

import PositionsTab from "./tabs/PositionsTab";
import TradeHistoryTab from "./tabs/TradeHistoryTab";
import OpenOrdersTab from "./tabs/OpenOrdersTab";

export default function TradeBottomTabs() {
  const { refreshAll } = useAccount();

  return (
    <Tabs
      defaultValue="positions"
      className="w-full"
      onValueChange={() => {
        refreshAll(); // 🔑 タブ切替時に再同期
      }}
    >
      <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0">
        <TabsTrigger value="positions">Positions</TabsTrigger>
        <TabsTrigger value="trade-history">Trade History</TabsTrigger>
        <TabsTrigger value="open-orders">Open Orders</TabsTrigger>
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
    </Tabs>
  );
}
