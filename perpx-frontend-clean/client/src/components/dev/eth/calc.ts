/**
 * ============================================================
 * Dev Calc
 * ============================================================
 *
 * Role:
 * - Dev only calculation helpers
 *
 * ============================================================
 */

export function calcUnrealizedPnL(
  sizeUsd: number,
  entry: number,
  current: number
): number {
  if (!entry) return 0;
  return (sizeUsd * (current - entry)) / entry;
}
