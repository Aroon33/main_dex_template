/**
 * ⚠️ DANGEROUS: TRON Unlimited APPROVE
 * -----------------------------------
 * - 実際に on-chain Tx を送信する
 * - 資産操作権限をコントラクトに与える
 * - TEST / DEV / PROD を必ず明示すること
 */

export async function approveUnlimitedTRC20(
  tokenAddress: string,
  spender: string
) {
  const tronWeb = (window as any).tronWeb;

  if (!tronWeb || !tronWeb.ready) {
    throw new Error("TronLink not ready");
  }

  const owner = tronWeb.defaultAddress.base58;

  // TRC20 コントラクト
  const contract = await tronWeb.contract().at(tokenAddress);

  // uint256 max
  const MAX_UINT =
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

  /**
   * ⚠️ ここで TronLink の
   * 「コントラクト実行 / 承認」ポップアップが出る
   */
  const tx = await contract
    .approve(spender, MAX_UINT)
    .send({
      from: owner,
      feeLimit: 100_000_000, // 100 TRX
    });

  return tx;
}
