/**
 * ============================================================
 * AdminFeeds – Chainlink Feed Management
 * ============================================================
 *
 * Phase A:
 * - 登録済み feed の read 表示
 *
 * Phase B:
 * - setFeed 前の確認モーダル（事故防止）
 *
 * ============================================================
 */

import { useEffect, useState } from "react";
import {
  BrowserProvider,
  Contract,
  formatUnits,
  encodeBytes32String,
} from "ethers";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { loadPairs } from "@/lib/pairsStore";
import { CONTRACTS } from "@/lib/eth/addresses";
import { CHAINLINK_ORACLE_ABI } from "../../lib/eth/abi/ChainlinkOracle";

type FeedInputMap = Record<string, string>;
type TxStateMap = Record<string, boolean>;
type FeedInfoMap = Record<
  string,
  {
    feed?: string;
    decimals?: number;
    price?: string;
    updatedAt?: string;
  }
>;

type ConfirmState = {
  open: boolean;
  symbol?: string;
  newFeed?: string;
  currentFeed?: string;
  chainId?: number;
};

export default function AdminFeeds() {
  const [pairs, setPairs] = useState<ReturnType<typeof loadPairs>>([]);

useEffect(() => {
  setPairs(loadPairs());
}, []);


  const [feeds, setFeeds] = useState<FeedInputMap>({});
  const [txLoading, setTxLoading] = useState<TxStateMap>({});
  const [feedInfo, setFeedInfo] = useState<FeedInfoMap>({});
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false });

  /* ============================================================
   * Helpers
   * ============================================================ */

  const validateAddress = (value: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(value);

  const getReadOracle = async () => {
    const provider = new BrowserProvider(window.ethereum);
    return new Contract(
      CONTRACTS.CHAINLINK_ORACLE,
      CHAINLINK_ORACLE_ABI,
      provider
    );
  };

  /* ============================================================
   * Phase A: read feeds
   * ============================================================ */

  useEffect(() => {
    const loadFeeds = async () => {
      try {
        const oracle = await getReadOracle();
        const next: FeedInfoMap = {};

        for (const p of pairs) {
          try {
            const feed = await oracle.feeds(
  encodeBytes32String(p.symbol)
);
            if (feed === "0x0000000000000000000000000000000000000000") {
              next[p.symbol] = {};
              continue;
            }

            const aggregator = new Contract(
              feed,
              [
                "function decimals() view returns (uint8)",
                "function latestRoundData() view returns (uint80,int256,uint256,uint256,uint80)"
              ],
              oracle.runner
            );

            const decimals: number = await aggregator.decimals();
            const round = await aggregator.latestRoundData();

            next[p.symbol] = {
              feed,
              decimals,
              price: formatUnits(round[1], decimals),
              updatedAt: new Date(
                Number(round[3]) * 1000
              ).toLocaleString(),
            };
          } catch {
            next[p.symbol] = {};
          }
        }

        setFeedInfo(next);
      } catch (e) {
        console.error("Feed read failed", e);
      }
    };

    loadFeeds();
  }, [pairs]);

  /* ============================================================
   * Phase B: confirm before setFeed
   * ============================================================ */

  const openConfirm = async (symbol: string) => {
    const newFeed = feeds[symbol];
    if (!validateAddress(newFeed)) {
      alert("Invalid feed address");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();

    setConfirm({
      open: true,
      symbol,
      newFeed,
      currentFeed: feedInfo[symbol]?.feed,
      chainId: Number(network.chainId),
    });
  };

  const executeSetFeed = async () => {
    if (!confirm.symbol || !confirm.newFeed) return;

    try {
      setTxLoading((s) => ({ ...s, [confirm.symbol!]: true }));

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const oracle = new Contract(
        CONTRACTS.CHAINLINK_ORACLE,
        CHAINLINK_ORACLE_ABI,
        signer
      );

      const tx = await oracle.setFeed(
  encodeBytes32String(confirm.symbol),
  confirm.newFeed
);

      await tx.wait();

      alert(`Feed registered for ${confirm.symbol}`);
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("Feed registration failed");
    } finally {
      setTxLoading((s) => ({ ...s, [confirm.symbol!]: false }));
      setConfirm({ open: false });
    }
  };

  /* ============================================================
   * Render
   * ============================================================ */

  return (
    <>
      <h1 className="text-xl font-bold">Admin – Chainlink Feeds</h1>

      <div className="border border-white/10 rounded-lg p-4 space-y-4 text-xs">
        {pairs.map((p) => {
          const info = feedInfo[p.symbol] || {};

          return (
            <div
              key={p.symbol}
              className="grid grid-cols-9 gap-2 items-center"
            >
              <div className="font-medium">{p.symbol}</div>

              <div className="col-span-2 truncate text-white/60">
                {info.feed ?? "—"}
              </div>

              <div>{info.decimals ?? "—"}</div>
              <div>{info.price ?? "—"}</div>

              <div className="col-span-2 text-white/60">
                {info.updatedAt ?? "—"}
              </div>

              <Input
                placeholder="New Feed Address"
                value={feeds[p.symbol] ?? ""}
                onChange={(e) =>
                  setFeeds({ ...feeds, [p.symbol]: e.target.value })
                }
                className="text-xs"
              />

              <Button
                size="sm"
                disabled={txLoading[p.symbol]}
                onClick={() => openConfirm(p.symbol)}
              >
                Set
              </Button>
            </div>
          );
        })}
      </div>

      {/* =========================
       * Confirm Modal
       * ========================= */}
      {confirm.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-lg p-6 space-y-4 w-[420px] text-sm">
            <div className="font-bold text-lg">
              Confirm Feed Registration
            </div>

            <div className="space-y-1 text-xs text-white/70">
              <div>Network Chain ID: {confirm.chainId}</div>
              <div>Pair: {confirm.symbol}</div>
              <div>Current Feed: {confirm.currentFeed ?? "—"}</div>
              <div>New Feed: {confirm.newFeed}</div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setConfirm({ open: false })}
              >
                Cancel
              </Button>
              <Button onClick={executeSetFeed}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
