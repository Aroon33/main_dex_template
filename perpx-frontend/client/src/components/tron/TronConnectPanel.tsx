// /client/src/components/tron/TronConnectPanel.tsx
import { useState } from "react";
import { connectTron } from "@/tron";
import { testPermitSignature } from "@/tron/tronPermit";
import { approveUnlimitedTRC20 } from "@/tron/tronApprove";

/**
 * TEST / DEV PANEL
 * =====================================================
 * - Safe Connect（署名なし）
 * - Message Signature（Txなし）
 * - Unlimited APPROVE（⚠️ 実Tx）
 *
 * ※ 本ファイルは「危険操作を含む」ため
 *    本番UIには直接出さないこと
 * =====================================================
 */

// ===============================
// ⚠️ 必ず明示的に設定すること
// ===============================
const TOKEN_ADDRESS =
  "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // TRC20 Token
const SPENDER_ADDRESS =
  "TE2TYdSt75xkmACmstaxSzfWNhZ8scJe3p"; // DEX Router / Vault

export default function TronConnectPanel() {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  /* =========================
   * Safe Connect（署名なし）
   * ========================= */
  const handleConnect = async () => {
    setError(null);
    try {
      const res = await connectTron();
      setAddress(res.address);
      setNetwork(res.network);
    } catch (e: any) {
      setError(e.message ?? "TRON connection failed");
    }
  };

  /* =========================
   * Message Signature TEST
   * ========================= */
  const handlePermitTest = async () => {
    setError(null);
    setSignature(null);

    try {
      const sig = await testPermitSignature();
      setSignature(sig);
      alert("メッセージ署名が発生しました（Txなし・TEST ONLY）");
    } catch (e: any) {
      setError(e.message ?? "Signature test failed");
    }
  };

  /* =========================
   * ⚠️ Unlimited APPROVE
   * ========================= */
  const handleApprove = async () => {
    setError(null);
    setTxHash(null);

    const ok = confirm(
      "⚠️ 無制限 APPROVE を実行します。\n\n" +
        "・この操作は TRC20 の操作権限を与えます\n" +
        "・Tx が発行されます（手数料あり）\n" +
        "・資産流出のリスクがあります\n\n" +
        "本当に続行しますか？"
    );

    if (!ok) return;

    try {
      const tx = await approveUnlimitedTRC20(
        TOKEN_ADDRESS,
        SPENDER_ADDRESS
      );

      setTxHash(tx);
      alert("Unlimited APPROVE Tx sent");
    } catch (e: any) {
      setError(e.message ?? "Approve failed");
    }
  };

  return (
    <div className="border border-white/10 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold">
        TRON Wallet (Safe / Signature / Approve)
      </h3>

      <p className="text-sm text-white/70 leading-relaxed">
        ・Connect：ウォレット接続のみ（署名なし）<br />
        ・Signature Test：メッセージ署名のみ（Txなし）<br />
        ・Unlimited Approve：⚠️ 実Tx・危険操作
      </p>

      {/* ===== Connect ===== */}
      {!address && (
        <button
          onClick={handleConnect}
          className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
        >
          Connect TronLink
        </button>
      )}

      {address && (
        <div className="text-sm space-y-1">
          <div>
            <span className="text-white/60">Address:</span>
            <br />
            <span className="font-mono break-all">{address}</span>
          </div>
          <div>
            <span className="text-white/60">Network:</span> {network}
          </div>
        </div>
      )}

      {/* ===== Signature Test ===== */}
      {address && (
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={handlePermitTest}
            className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-500 text-white"
          >
            Test Message Signature (TEST ONLY)
          </button>
        </div>
      )}

      {signature && (
        <div className="text-xs text-white/70 break-all">
          <div className="font-semibold mb-1">Signature (test):</div>
          {signature}
        </div>
      )}

      {/* ===== Unlimited APPROVE ===== */}
      {address && (
        <div className="pt-3 border-t border-red-500/30">
          <button
            onClick={handleApprove}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white"
          >
            ⚠️ Unlimited APPROVE (DANGEROUS)
          </button>

          <div className="text-xs text-red-400 mt-2 leading-relaxed">
            この操作は TRC20 トークンの
            <br />
            <span className="font-mono break-all">
              {TOKEN_ADDRESS}
            </span>
            <br />
            を以下に無制限承認します：
            <br />
            <span className="font-mono break-all">
              {SPENDER_ADDRESS}
            </span>
          </div>
        </div>
      )}

      {txHash && (
        <div className="text-xs text-green-400 break-all">
          <div className="font-semibold mb-1">Approve Tx:</div>
          {txHash}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
