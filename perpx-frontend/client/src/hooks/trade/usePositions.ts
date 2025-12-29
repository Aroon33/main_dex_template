/**
 * ===============================
 * Trade Module Rule (IMPORTANT)
 * ===============================
 *
 * - provider / account は必ず AccountContext から取得する
 * - BrowserProvider を新規生成しない
 * - window.ethereum を直接参照しない
 * - このファイルは UI / Logic のみを担当する
 *
 * Data Flow:
 * Wallet -> AccountContext -> Trade Page / Hooks
 *
 * ===============================
 */

import { useAccount } from "@/contexts/AccountContext";

export function usePositions() {
  const { provider, account } = useAccount();

  if (!provider || !account) {
    return {};
  }

  return {};
}
