/**
 * ============================================================
 * PositionRow
 * ============================================================
 *
 * Role:
 * - Display single position
 * - Provide close / partial close actions
 *
 * ============================================================
 */

import { useState } from "react";
import { Position } from "@/types";
import { useClosePosition, usePartialClose } from "@/hooks/trade";

type Props = {
  position: Position;
};

export function PositionRow({ position }: Props) {
  const { closePosition, loading: closing } = useClosePosition();
  const { partialClose, loading: partialLoading } = usePartialClose();

  const [partialSize, setPartialSize] = useState("");

  return (
    <tr>
      <td>{position.pair}</td>
      <td>{position.side}</td>
      <td>{position.size}</td>
      <td>{position.entryPrice}</td>
      <td>{position.margin}</td>
      <td>
        {/* Full close */}
        <button
          disabled={closing}
          onClick={() =>
            closePosition({ positionId: position.id })
          }
        >
          Close
        </button>

        {/* Partial close */}
        <input
          style={{ width: 60, marginLeft: 8 }}
          placeholder="Size"
          value={partialSize}
          onChange={(e) => setPartialSize(e.target.value)}
        />
        <button
          disabled={partialLoading}
          onClick={() =>
            partialClose({
              positionId: position.id,
              closeSizeUsd: Number(partialSize),
            })
          }
        >
          Partial
        </button>
      </td>
    </tr>
  );
}
