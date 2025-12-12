import { parseAbi, toHex } from "viem";
import { getPublicClient, getWalletClient } from "@wagmi/core";
import { wagmiConfig } from "@/src/config/wagmi";

export function getContract(name: string) {
  const address = process.env.NEXT_PUBLIC_PERP_ADDRESS as `0x${string}`;

  if (name !== "perpetual") {
    throw new Error("Unknown contract name: " + name);
  }

  const abi = parseAbi([
    "function openPosition(bytes32 asset, int256 size, uint256 price) external",
    "function closePosition(bytes32 asset) external",
    "function getPosition(address user, bytes32 asset) external view returns (int256 size, uint256 entryPrice)"
  ]);

  return {
    read: {
      async getPosition(user: string, asset: string) {
        const publicClient = getPublicClient(wagmiConfig);

        return publicClient.readContract({
          address,
          abi,
          functionName: "getPosition",
          args: [
            user as `0x${string}`,              // ★ アドレス型として扱う
            toHex(asset, { size: 32 }),         // ★ bytes32 変換
          ],
        });
      },
    },

    write: {
      async openPosition(args: any[]) {
        const walletClient = await getWalletClient(wagmiConfig);
        if (!walletClient) throw new Error("Wallet not connected");

        const [asset, size, price] = args;

        return walletClient.writeContract({
          address,
          abi,
          functionName: "openPosition",
          args: [
            toHex(asset, { size: 32 }),
            size,
            price,
          ],
        });
      },
    },
  };
}
