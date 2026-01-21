/**
 * ============================================================
 * useRuntimeConfig
 * ============================================================
 *
 * Role:
 * - Load runtime config.json via HTTP
 * - Allow config changes without rebuild
 *
 * ============================================================
 */

import { useEffect, useState } from "react";

export type RuntimeConfig = {
  network: string;
  dev: {
    userAddress: string;
  };
  decimals: {
    price: number;
    token: number;
  };
  pairs: Record<
    string,
    {
      symbol: string;
      displayName?: string;
      enabled: boolean;
    }
  >;
};

export function useRuntimeConfig() {
  const [config, setConfig] = useState<RuntimeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/docs/config.json");
        if (!res.ok) {
          throw new Error("Failed to load config.json");
        }

        const json = (await res.json()) as RuntimeConfig;

        if (!cancelled) {
          setConfig(json);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message ?? "Unknown error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { config, loading, error };
}
