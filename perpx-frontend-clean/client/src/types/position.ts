/**
 * ============================================================
 * Position Type
 * ============================================================
 *
 * Role:
 * - Normalized open position for Trade UI
 *
 * ============================================================
 */

export type Position = {
  id: string;
  pair: string;
  side: "long" | "short";

  size: number;
  entryPrice: number;
  margin: number;
};
