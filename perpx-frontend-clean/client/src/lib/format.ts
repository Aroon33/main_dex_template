import { formatUnits } from "ethers";

export function formatUSD(value: bigint, decimals = 18) {
  return Number(formatUnits(value, decimals)).toFixed(2);
}
