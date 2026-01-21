/**
 * 危険な API を誤って使わないためのガード
 * import して参照することで「禁止事項」を明文化する
 */

export const FORBIDDEN_TRON_APIS = [
  "sign",
  "signMessage",
  "requestSignature",
  "approve",
  "permit",
  "sendTransaction",
  "triggerSmartContract",
  "privateKey",
  "seed",
  "recovery",
] as const;

export function assertSafeTronUsage(codeContext: string) {
  for (const key of FORBIDDEN_TRON_APIS) {
    if (codeContext.includes(key)) {
      throw new Error(
        `[TRON GUARD] Forbidden API detected: "${key}"`
      );
    }
  }
}
