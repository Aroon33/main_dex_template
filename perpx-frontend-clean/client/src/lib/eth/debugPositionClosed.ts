import { BrowserProvider, Contract, EventLog, ethers } from "ethers";
import { CONTRACTS } from "./addresses";
import { PERPETUAL_TRADING_ABI } from "./abi/PerpetualTrading";

export async function debugPositionClosed() {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const user = await signer.getAddress();

  console.log("🔍 Debug PositionClosed");
  console.log("PerpetualTrading:", CONTRACTS.PERPETUAL_TRADING);
  console.log("User:", user);

  const perp = new Contract(
    CONTRACTS.PERPETUAL_TRADING,
    PERPETUAL_TRADING_ABI,
    provider
  );

  const logs = await perp.queryFilter(
    perp.filters.PositionClosed(user)
  );

  const events = logs.filter(
    (log): log is EventLog => log instanceof EventLog
  );

  console.log("📦 PositionClosed events:", events);

  events.forEach((e, i) => {
    const {
      positionId,
      pair,
      size,
      entryPrice,
      exitPrice,
      realizedPnL,
      timestamp,
    } = e.args;

    console.log(`Event #${i}`, {
      positionId: positionId.toString(),
      symbol: ethers.decodeBytes32String(pair),
      side: size > 0n ? "BUY" : "SELL",
      size: size.toString(),
      entryPrice: entryPrice.toString(),
      exitPrice: exitPrice.toString(),
      realizedPnL: realizedPnL.toString(),
      timestamp: timestamp.toString(),
      txHash: e.transactionHash,
    });
  });
}
