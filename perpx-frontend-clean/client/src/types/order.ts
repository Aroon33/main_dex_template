/**
 * ============================================================
 * Order Type
 * ============================================================
 */

export type Order = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  type: string;
  size: number;
  status: "open" | "filled" | "cancelled";
};
