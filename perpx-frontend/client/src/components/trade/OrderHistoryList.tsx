/**
 * ============================================================
 * OrderHistoryList
 * ============================================================
 *
 * Role:
 * - Display order timeline (event-driven)
 *
 * ============================================================
 */

import { Order } from "@/types";

type Props = {
  orders: Order[];
};

export default function OrderHistoryList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="text-muted-foreground">
        No orders
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((o) => (
        <div
          key={o.id}
          className="flex justify-between text-sm border-b pb-1"
        >
          <div>
            <div className="font-medium">{o.symbol}</div>
            <div className="text-xs text-muted-foreground">
              {o.side.toUpperCase()} {o.type.toUpperCase()}
            </div>
          </div>

          <div className="text-right">
            <div>Size: {o.size}</div>
            <div
              className={
                o.status === "filled"
                  ? "text-green-500"
                  : o.status === "cancelled"
                  ? "text-red-500"
                  : "text-muted-foreground"
              }
            >
              {o.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
