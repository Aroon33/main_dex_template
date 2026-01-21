import { useEffect, useState } from "react";
import { loadPairs, PairItem } from "@/lib/pairsStore";

export function usePairs() {
  const [pairs, setPairs] = useState<PairItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = loadPairs();
    setPairs(data.filter(p => p.enabled));
    setLoading(false);
  }, []);

  return { pairs, loading };
}
