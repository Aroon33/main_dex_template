/**
 * ============================================================
 * useTradeHistorySimple
 * ============================================================
 *
 * Role:
 * - Provide trade history for UI
 *
 * Rule:
 * - Accept account address ONLY
 * - NO BrowserProvider
 * - NO AccountContext
 *
 * ============================================================
 */

export type Trade = {
  id: string;
  symbol: string;
  price: number;
  pnl: number;
  timestamp: number;
};

export function useTradeHistorySimple(account?: string) {
  if (!account) {
    return {
      trades: [] as Trade[],
      loading: false,
    };
  }

  // TODO: 実 on-chain / API 実装
  return {
    trades: [] as Trade[],
    loading: false,
  };
}
