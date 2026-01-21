/**
 * ============================================================
 * Number Utils
 * ============================================================
 *
 * Role:
 * - Normalize on-chain numbers
 *
 * ============================================================
 */

export function fromUnits(
  value: bigint,
  decimals: number
): number {
  return Number(value) / 10 ** decimals;
}
