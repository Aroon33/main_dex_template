// /client/src/tron/index.ts
export async function connectTron() {
  const tronWeb = (window as any).tronWeb;

  if (!tronWeb) {
    throw new Error("TronLink not installed");
  }

  if (!tronWeb.ready) {
    // TronLinkは ready になるまで待つ必要あり
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const address = tronWeb.defaultAddress.base58;

  if (!address) {
    throw new Error("Wallet not connected");
  }

  const network =
    tronWeb.fullNode.host.includes("nile")
      ? "Nile Testnet"
      : tronWeb.fullNode.host.includes("shasta")
      ? "Shasta Testnet"
      : "Mainnet";

  return { address, network };
}
