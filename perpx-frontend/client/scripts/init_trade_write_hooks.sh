#!/bin/bash
set -e

echo "== Initialize trade write hook structure =="

BASE="src/hooks/trade"

mkdir -p $BASE/read
mkdir -p $BASE/write

# ===== READ HOOK PLACEHOLDERS =====

cat << 'EOT' > $BASE/read/useTradeHistory.ts
/**
 * Trade History (read)
 * - on-chain view + event
 */
export {};
EOT

cat << 'EOT' > $BASE/read/usePositions.ts
/**
 * Positions (read)
 * - on-chain view + event
 */
export {};
EOT

cat << 'EOT' > $BASE/read/useOrderHistory.ts
/**
 * Orders (read)
 * - event driven
 */
export {};
EOT

cat << 'EOT' > $BASE/read/useOrderBook.ts
/**
 * OrderBook (read)
 * - WebSocket
 */
export {};
EOT

# ===== WRITE HOOK PLACEHOLDERS =====

cat << 'EOT' > $BASE/write/useClosePosition.ts
/**
 * ============================================================
 * useClosePosition
 * ============================================================
 *
 * Role:
 * - Close full position (write)
 *
 * ============================================================
 */

export function useClosePosition() {
  const closePosition = async (positionId: string) => {
    // TODO: implement
  };

  return { closePosition };
}
EOT

cat << 'EOT' > $BASE/write/usePartialClose.ts
/**
 * ============================================================
 * usePartialClose
 * ============================================================
 *
 * Role:
 * - Close part of a position (write)
 *
 * ============================================================
 */

export function usePartialClose() {
  const closePartial = async (
    positionId: string,
    size: bigint
  ) => {
    // TODO: implement
  };

  return { closePartial };
}
EOT

cat << 'EOT' > $BASE/write/useClaimPnL.ts
/**
 * ============================================================
 * useClaimPnL
 * ============================================================
 *
 * Role:
 * - Claim realized PnL (write)
 *
 * ============================================================
 */

export function useClaimPnL() {
  const claimPnL = async () => {
    // TODO: implement
  };

  return { claimPnL };
}
EOT

cat << 'EOT' > $BASE/index.ts
// Re-export hooks (optional)
export {};
EOT

echo "== Trade hook structure created successfully =="
