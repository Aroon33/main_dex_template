import { BrowserProvider, Contract, EventLog, ethers } from "ethers";
import { CONTRACTS } from "../addresses";
import { PERPETUAL_TRADING_ABI } from "../abi/PerpetualTrading";
import { ERC20_ABI } from "../abi/ERC20";
import { normalize } from "../../number";


/**
 * デバッグ用コンソール操作ユーティリティ
 * ※ 本番コードでは使わない
 */
export async function debugConsole() {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const user = await signer.getAddress();

  console.log("==================================");
  console.log("🛠 Debug Console");
  console.log("User:", user);
  console.log("Perp:", CONTRACTS.PERPETUAL_TRADING);
  console.log("Router:", CONTRACTS.ROUTER);
  console.log("Token:", CONTRACTS.COLLATERAL_TOKEN);
  console.log("==================================");

  /* ======================
     Contracts
  ====================== */

  const perp = new Contract(
    CONTRACTS.PERPETUAL_TRADING,
    PERPETUAL_TRADING_ABI,
    provider
  );

  const token = new Contract(
    CONTRACTS.COLLATERAL_TOKEN,
    ERC20_ABI,
    signer
  );

  /* ======================
     1. balances / allowance
  ====================== */

  const balance = await token.balanceOf(user);
  const allowance = await token.allowance(user, CONTRACTS.ROUTER);

  console.log("💰 Wallet balance:", normalize(balance, 18));
  console.log("🔓 Allowance to Router:", normalize(allowance, 18));

  /* ======================
     2. approve (必要なら)
  ====================== */

  async function approve(amountUsd: number) {
    const amount = ethers.parseUnits(amountUsd.toString(), 18);
    console.log("👉 Approving:", amountUsd, "tUSD");
    const tx = await token.approve(CONTRACTS.ROUTER, amount);
    await tx.wait();
    console.log("✅ Approve completed");
  }

  /* ======================
     3. deposit
  ====================== */

  async function deposit(amountUsd: number) {
    const router = new Contract(
      CONTRACTS.ROUTER,
      [
        "function deposit(uint256 amount)",
      ],
      signer
    );

    const amount = ethers.parseUnits(amountUsd.toString(), 18);
    console.log("👉 Depositing:", amountUsd, "tUSD");
    const tx = await router.deposit(amount);
    await tx.wait();
    console.log("✅ Deposit completed");
  }

  /* ======================
     4. open position
  ====================== */

  async function open(sizeUsd: number) {
    const router = new Contract(
      CONTRACTS.ROUTER,
      [
        "function openPosition(bytes32 pair,int256 size)",
      ],
      signer
    );

    const pair = ethers.encodeBytes32String("tUSD");
    const size = BigInt(sizeUsd);

    console.log("👉 Opening position:", sizeUsd, "USD");
    const tx = await router.openPosition(pair, size);
    await tx.wait();
    console.log("✅ Position opened");
  }

  /* ======================
     5. close position
  ====================== */

  async function close(positionId: number) {
    const router = new Contract(
      CONTRACTS.ROUTER,
      [
        "function closePosition(uint256 positionId)",
      ],
      signer
    );

    console.log("👉 Closing position:", positionId);
    const tx = await router.closePosition(positionId);
    await tx.wait();
    console.log("✅ Position closed");
  }

  /* ======================
     6. PositionClosed events
  ====================== */

  async function showClosedEvents() {
    const logs = await perp.queryFilter(
      perp.filters.PositionClosed(user)
    );

    const events = logs.filter(
      (log): log is EventLog => log instanceof EventLog
    );

    console.log("📦 PositionClosed events:", events.length);

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
        sizeUsd: size.toString(),
        entryPrice: normalize(entryPrice, 8),
        exitPrice: normalize(exitPrice, 8),
        realizedPnL: realizedPnL.toString(),
        timestamp: new Date(Number(timestamp) * 1000),
        txHash: e.transactionHash,
      });
    });
  }

  /* ======================
     expose helpers
  ====================== */

  return {
    approve,
    deposit,
    open,
    close,
    showClosedEvents,
  };
}
