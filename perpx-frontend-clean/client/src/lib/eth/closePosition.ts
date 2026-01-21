import { BrowserProvider } from "ethers";
import { getRouter } from "./getRouter";

/**
 * Full close position
 * @param positionId uint256 position id
 */
export const closePosition = async (positionId: bigint): Promise<void> => {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const router = getRouter(signer);

  const tx = await router.closePosition(positionId);
  await tx.wait();
};

/**
 * Partial close position
 * @param positionId uint256 position id
 * @param closeSize int256 close size (USD notional)
 */
export const closePositionPartial = async (
  positionId: bigint,
  closeSize: bigint
): Promise<void> => {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const router = getRouter(signer);

  // ⚠️ user は渡さない（Router が msg.sender を使う）
  const tx = await router.closePositionPartial(positionId, closeSize);
  await tx.wait();
};
