import { BrowserProvider } from "ethers";
import { getRouter } from "./getRouter";

export async function getUserPositions(pair: string) {
  if (!window.ethereum) {
    throw new Error("Wallet not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const router = getRouter(provider);

  // ① position IDs
  const ids: bigint[] = await router.getUserPositionIds(address);

  // ② position details
  const positions = await Promise.all(
    ids.map(async (id) => {
      const pos = await router.getPosition(pair, id);
      return {
        id: id.toString(),
        size: pos.size,
        entryPrice: pos.entryPrice,
        pnl: pos.pnl,
      };
    })
  );

  return positions;
}
