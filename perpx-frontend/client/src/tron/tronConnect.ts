/**
 * TRON Wallet Connect (SAFE)
 * - 署名なし
 * - Txなし
 * - approveなし
 */

export type TronConnectResult = {
  address: string;
  network: "mainnet" | "nile" | "shasta" | "unknown";
};

export async function connectTron(): Promise<TronConnectResult> {
  const tronWeb = (window as any).tronWeb;

  if (!tronWeb) {
    throw new Error("TronLink not installed");
  }

  // ユーザー操作による接続要求
  if (!tronWeb.ready) {
    await tronWeb.request({ method: "tron_requestAccounts" });
  }

  if (!tronWeb.defaultAddress?.base58) {
    throw new Error("Wallet not connected");
  }

  const address = tronWeb.defaultAddress.base58;

  // ネットワーク判定
  let network: TronConnectResult["network"] = "unknown";
  const host = tronWeb.fullNode?.host ?? "";

  if (host.includes("trongrid.io")) network = "mainnet";
  else if (host.includes("nile")) network = "nile";
  else if (host.includes("shasta")) network = "shasta";

  return { address, network };
}
