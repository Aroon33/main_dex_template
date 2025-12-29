export function calcUnrealizedPnL(
  size: bigint,
  entryPrice: bigint,
  currentPrice: bigint
): bigint {
  return (size * (currentPrice - entryPrice)) / entryPrice;
}
