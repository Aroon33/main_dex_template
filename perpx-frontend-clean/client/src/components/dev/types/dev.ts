/**
 * ============================================================
 * Dev Types
 * ============================================================
 *
 * Role:
 * - Shared types for dev components
 *
 * ============================================================
 */

export type DevPosition = {
  sizeUsd: number;
  entryPrice: number | null;
  unrealizedPnL: number;
};

export type DevState = {
  oraclePrice: number;
  balance: number;
  allowance: number;
  margin: number;
  claimablePnL: number;
  position: DevPosition;
};
