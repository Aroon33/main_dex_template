/**
 * ============================================================
 * usePositions
 * ============================================================
 *
 * Role:
 * - Provide open positions for UI
 *
 * Rule:
 * - Accept account address ONLY
 * - NO provider / AccountContext access
 * - Must always export a module
 *
 * ============================================================
 */

export type Position = {
  id: string;
  pair: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
};

export function usePositions(account?: string) {
  // account 未接続時も安全
  if (!account) {
    return {
      positions: [] as Position[],
      loading: false,
    };
  }

  // ※ 実データ実装は後でOK
  return {
    positions: [] as Position[],
    loading: false,
  };
}
