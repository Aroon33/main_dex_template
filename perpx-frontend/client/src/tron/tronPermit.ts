/**
 * TEST ONLY: TRON Message Signature Test
 * -------------------------------------
 * - メッセージ署名のみ
 * - Txは作らない
 * - broadcastしない
 * - 資産は一切動かない
 */

export async function testPermitSignature(): Promise<string> {
  const tronWeb = (window as any).tronWeb;

  if (!tronWeb || !tronWeb.ready) {
    throw new Error("TronLink not ready");
  }

  const address = tronWeb.defaultAddress.base58;

  const message = `
TRON SIGNATURE TEST (NO TX)
--------------------------
Address: ${address}
Purpose: Permit / Login / Ownership Proof
No transaction
No asset movement
Timestamp: ${Date.now()}
  `.trim();

  // 🔐 メッセージをHEX化して署名
  const hexMessage = tronWeb.toHex(message);

  // ⚠️ ここで署名ポップアップが出る
  const signature = await tronWeb.trx.sign(hexMessage);

  return signature;
}
