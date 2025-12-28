import { BrowserProvider, Contract, EventLog, ethers } from "ethers";
import { CONTRACTS } from "./addresses";
import { PERPETUAL_TRADING_ABI } from "./abi/PerpetualTrading";

export async function getTradeHistory() {
  if (!window.ethereum) throw new Error("Wallet not found");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const user = await signer.getAddress();

  const perp = new Contract(
    CONTRACTS.PERPETUAL_TRADING,
    PERPETUAL_TRADING_ABI,
    provider
  );

  const logs = await perp.queryFilter(
    perp.filters.PositionClosed(user)
  );

  const events = logs.filter(
    (l): l is EventLog => l instanceof EventLog
  );

  return events.map((e) => {
    const {
      positionId,
      pair,
      size,
      entryPrice,
      exitPrice,
      realizedPnL,
      timestamp,
    } = e.args;

    return {
      id: positionId.toString(),
      symbol: ethers.decodeBytes32String(pair),
      side: size > 0n ? "BUY" : "SELL",
      sizeUsd: Math.abs(Number(size)),
      entryPrice: Number(entryPrice) / 1e8,
      closePrice: Number(exitPrice) / 1e8,
      pnl: Number(realizedPnL) / 1e18,
      timestamp: Number(timestamp) * 1000,
      txHash: e.transactionHash,
    };
  });
}
