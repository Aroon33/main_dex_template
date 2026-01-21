/**
 * ============================================================
 * pairsStore – Pair SSOT
 * ============================================================
 *
 * - ペア管理の Single Source of Truth
 * - localStorage 永続
 * - Admin / Trade 共通
 *
 * ============================================================
 */

export type PriceSource = "chainlink" | "manual";

export type PairItem = {
  symbol: string;
  display: string;
  enabled: boolean;
  priceSource?: PriceSource; // ← optional（後方互換）
};

const KEY = "perpx:pairs";

/** 初期値（pairs.json 相当） */
const DEFAULT_PAIRS: PairItem[] = [
  { symbol: "tUSD", display: "tUSD / USD", enabled: true, priceSource: "manual" },
  { symbol: "BTC", display: "BTC / USD", enabled: true, priceSource: "manual" },
  { symbol: "ETH", display: "ETH / USD", enabled: true, priceSource: "manual" },

  { symbol: "SOL", display: "SOL / USD", enabled: true, priceSource: "manual" },
  { symbol: "ARB", display: "ARB / USD", enabled: true, priceSource: "manual" },
  { symbol: "OP",  display: "OP / USD",  enabled: true, priceSource: "manual" },

  { symbol: "AVAX", display: "AVAX / USD", enabled: true, priceSource: "manual" },
  { symbol: "MATIC",display: "MATIC / USD",enabled: true, priceSource: "manual" },
  { symbol: "ADA",  display: "ADA / USD",  enabled: true, priceSource: "manual" },
  { symbol: "XRP",  display: "XRP / USD",  enabled: true, priceSource: "manual" },
  { symbol: "DOGE", display: "DOGE / USD", enabled: true, priceSource: "manual" },

  { symbol: "DOT",  display: "DOT / USD",  enabled: true, priceSource: "manual" },
  { symbol: "LINK", display: "LINK / USD", enabled: true, priceSource: "manual" },
  { symbol: "UNI",  display: "UNI / USD",  enabled: true, priceSource: "manual" },
  { symbol: "AAVE", display: "AAVE / USD", enabled: true, priceSource: "manual" },
  { symbol: "ATOM", display: "ATOM / USD", enabled: true, priceSource: "manual" },

  { symbol: "NEAR", display: "NEAR / USD", enabled: true, priceSource: "manual" },
  { symbol: "SUI",  display: "SUI / USD",  enabled: true, priceSource: "manual" },
  { symbol: "APT",  display: "APT / USD",  enabled: true, priceSource: "manual" },
  { symbol: "PEPE", display: "PEPE / USD", enabled: true, priceSource: "manual" },
  { symbol: "BONK", display: "BONK / USD", enabled: true, priceSource: "manual" },
];

/**
 * loadPairs
 * - 既存 localStorage を読み込む
 * - priceSource が無い場合は自動補完
 */
export function loadPairs(): PairItem[] {
  if (typeof window === "undefined") return DEFAULT_PAIRS;

  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_PAIRS));
    return DEFAULT_PAIRS;
  }

  try {
    const parsed: PairItem[] = JSON.parse(raw);

    // 🔑 後方互換補正
    return parsed.map((p) => ({
      ...p,
      priceSource: p.priceSource ?? "manual",
    }));
  } catch {
    return DEFAULT_PAIRS;
  }
}

export function savePairs(pairs: PairItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(pairs));
}
