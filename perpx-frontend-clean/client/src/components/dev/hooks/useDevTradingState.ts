/**
 * ============================================================
 * useDevTradingState
 * ============================================================
 *
 * Role:
 * - Aggregate dev on-chain state
 *
 * Rule:
 * - Admin only
 * - Read only (write is future)
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { readDevState } from "../eth/reader";
import { DevState } from "../types/dev";

export function useDevTradingState(
  provider: BrowserProvider,
  account: string
) {
  const [state, setState] = useState<DevState | null>(null);

  const refresh = async () => {
    const data = await readDevState(provider, account);
    setState(data);
  };

  useEffect(() => {
    refresh().catch(() => {});
  }, [account]);

  return {
    state,
    refresh,
  };
}
