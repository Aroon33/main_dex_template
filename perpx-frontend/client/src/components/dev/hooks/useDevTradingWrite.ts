/**
 * ============================================================
 * useDevTradingWrite
 * ============================================================
 *
 * Role:
 * - UI wrapper for dev write operations
 *
 * ============================================================
 */

import { BrowserProvider } from "ethers";
import {
  devDeposit,
  devWithdraw,
  devOpenPosition,
  devClosePosition,
  devClaimPnL,
} from "../eth/writer";

export function useDevTradingWrite(provider: BrowserProvider) {
  return {
    deposit: (amount: number) => devDeposit(provider, amount),
    withdraw: (amount: number) => devWithdraw(provider, amount),
    openPosition: (size: number) => devOpenPosition(provider, size),
    closePosition: (id: number) => devClosePosition(provider, id),
    claimPnL: () => devClaimPnL(provider),
  };
}
