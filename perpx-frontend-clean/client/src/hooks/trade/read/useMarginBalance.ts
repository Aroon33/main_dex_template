/**
 * ============================================================
 * useMarginBalance (READ)
 * ============================================================
 *
 * - AccountContext を唯一の情報源とする
 * - provider / Contract / ethereum は一切扱わない
 *
 * ============================================================
 */

import { useAccount } from "@/contexts/AccountContext";

export function useMarginBalance() {
  const { marginBalance, isLoading } = useAccount();

  return {
    balance: marginBalance,
    loading: isLoading,
  };
}
