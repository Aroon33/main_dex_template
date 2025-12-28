import { BrowserProvider } from "ethers";
import { getRouter } from "./getRouter";

export async function openPosition(
  marketId: string,
  size: bigint
) {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const router = getRouter(signer);

  const tx = await router.openPosition(marketId, size);
  return tx.wait();
}
