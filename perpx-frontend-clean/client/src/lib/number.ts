// src/lib/number.ts
export const normalize = (
  value: bigint,
  decimals: number
): number => {
  return Number(value) / 10 ** decimals;
};
