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
  const account = useAccount();

  return {
    balance: Number(account.balance || "0"),
    loading: account.isLoadingBalance,
  };
}
