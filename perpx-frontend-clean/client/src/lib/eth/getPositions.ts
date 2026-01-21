import { BrowserProvider, Contract } from "ethers";
import { getRouter } from "./getRouter";
import { CONTRACTS } from "./addresses";
import { ORACLE_ABI } from "./abi/Oracle";
import { ethers } from "ethers";

/**
 * Raw on-chain position data
 * All numeric values are bigint
 */
export type RawPosition = {
  id: string;
  pair: string;
  symbol: string;
  side: "long" | "short";

  size: bigint;          // USD notional (raw)
  entryPrice: bigint;    // USD × 1e8
  currentPrice: bigint;  // USD × 1e8
  margin: bigint;        // trader margin snapshot (raw)

  isOpen: boolean;
};

export async function getPositions(): Promise<RawPosition[]> {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const user = await signer.getAddress();

  const router = getRouter(provider);

  // trader total margin (raw)
  const traderMargin: bigint = await router.getMargin(user);

  // user position IDs
  const ids: bigint[] = await router.getUserPositionIds(user);

  // oracle
  const oracle = new Contract(
    CONTRACTS.PRICE_ORACLE,
    ORACLE_ABI,
    provider
  );

  const positions: RawPosition[] = [];

  for (const id of ids) {
  const result = await router.getPosition(user, id);

  const pair: string = result[0];
  const size: bigint = result[1];
  const entryPrice: bigint = result[2];
  const positionMargin: bigint = result[3];
  const isOpen: boolean = result[4];

  if (!isOpen) continue; // ← ★これだけ追加

  const currentPrice: bigint = await oracle.getPrice(pair);

  const symbol = ethers.decodeBytes32String(pair);
  const side: "long" | "short" = size > 0n ? "long" : "short";

  positions.push({
    id: id.toString(),
    pair,
    symbol,
    side,
    size,
    entryPrice,
    currentPrice,
    margin: positionMargin,
    isOpen,
  });
}


  return positions;
}
