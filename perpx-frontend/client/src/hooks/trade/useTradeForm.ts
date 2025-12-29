/**
 * ============================================================
 * TRADE MODULE RULES (DO NOT REMOVE)
 * ============================================================
 *
 * ■ Purpose
 * ------------------------------------------------------------
 * This file is part of the Trade module.
 * The rules below are a CONTRACT to prevent architectural
 * regressions and build-time errors.
 *
 * ■ Data / Dependency Rules
 * ------------------------------------------------------------
 * 1. AccountContext is INTERNAL ONLY.
 *    - Do NOT destructure or rely on undocumented properties.
 *    - Pages may call useAccount(), but must NOT depend on
 *      provider/account shapes unless explicitly exported.
 *
 * 2. Hooks under src/hooks/trade MUST be PURE.
 *    - NO direct access to AccountContext or WalletContext.
 *    - NO window.ethereum usage.
 *    - NO BrowserProvider creation.
 *    - All external data must be passed via function arguments.
 *
 * 3. UI Components MUST consume hook results only.
 *    - UI never talks to Context directly.
 *    - UI never creates providers or side-effects for data fetching.
 *
 * ■ Naming / Export Rules
 * ------------------------------------------------------------
 * - 1 file = 1 hook/component = 1 export.
 * - Export names MUST match import names exactly.
 * - Avoid suffix mismatches (e.g. Simple vs non-Simple).
 *
 * ■ Build Safety Rules
 * ------------------------------------------------------------
 * - If a file is not used, it MUST NOT contain broken imports.
 * - Unused legacy files should be emptied (`export {}`) or archived.
 * - Partial edits are forbidden for core files:
 *   always replace the whole file when changing structure.
 *
 * ■ Modification Policy
 * ------------------------------------------------------------
 * - This header MUST stay at the top of the file.
 * - When modifying logic, keep this header unchanged.
 * - When refactoring, copy the entire file and replace it fully.
 *
 * ============================================================
 */


import { useState } from "react";

export type OrderType = "market" | "limit" | "stop";
export type MarginMode = "cross" | "isolated";

export function useTradeForm(balance: number) {
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [marginMode, setMarginMode] = useState<MarginMode>("cross");
  const [leverage, setLeverage] = useState(25);

  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");

  const handlePercentageClick = (percent: number) => {
    const calculatedAmount = (balance * percent) / 100;
    setAmount(calculatedAmount.toFixed(2));
  };

  return {
    // state
    orderType,
    marginMode,
    leverage,
    amount,
    limitPrice,
    stopPrice,

    // setters
    setOrderType,
    setMarginMode,
    setLeverage,
    setAmount,
    setLimitPrice,
    setStopPrice,

    // helpers
    handlePercentageClick,
  };
}
