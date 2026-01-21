/**
 * ============================================================
 * Dev Writer
 * ============================================================
 *
 * Role:
 * - Admin only write operations
 *
 * ============================================================
 */

import { BrowserProvider, Contract, ethers } from "ethers";
import { CONTRACTS } from "@/lib/eth/addresses";
import { handleTx } from "./tx";

export const PAIR = ethers.encodeBytes32String("tUSD");

export async function devDeposit(
  provider: BrowserProvider,
  amountUsd: number
) {
  const signer = await provider.getSigner();

  const router = new Contract(
    CONTRACTS.ROUTER,
    ["function deposit(uint256)"],
    signer
  );

  const value = ethers.parseEther(amountUsd.toString());
  await handleTx(router.deposit(value), "Deposit");
}

export async function devWithdraw(
  provider: BrowserProvider,
  amountUsd: number
) {
  const signer = await provider.getSigner();

  const router = new Contract(
    CONTRACTS.ROUTER,
    ["function withdraw(uint256)"],
    signer
  );

  const value = ethers.parseEther(amountUsd.toString());
  await handleTx(router.withdraw(value), "Withdraw");
}

export async function devOpenPosition(
  provider: BrowserProvider,
  sizeUsd: number
) {
  const signer = await provider.getSigner();

  const router = new Contract(
    CONTRACTS.ROUTER,
    ["function openPosition(bytes32,int256)"],
    signer
  );

  const size = ethers.parseUnits(sizeUsd.toString(), 0);
  await handleTx(router.openPosition(PAIR, size), "Open Position");
}

export async function devClosePosition(
  provider: BrowserProvider,
  positionId: number
) {
  const signer = await provider.getSigner();

  const router = new Contract(
    CONTRACTS.ROUTER,
    ["function closePosition(uint256)"],
    signer
  );

  await handleTx(router.closePosition(positionId), "Close Position");
}

export async function devClaimPnL(
  provider: BrowserProvider
) {
  const signer = await provider.getSigner();

  const perp = new Contract(
    CONTRACTS.PERPETUAL_TRADING,
    ["function claimPnL(address)"],
    signer
  );

  const user = await signer.getAddress();
  await handleTx(perp.claimPnL(user), "Claim PnL");
}
