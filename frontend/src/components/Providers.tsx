"use client";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/src/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";

/* ============================
   React Query 設定（Astrodex 仕様）
   ============================ */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 10,
    },
  },
});

/* ============================
   Providers（App 全体を包む）
   ============================ */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<PageFallback />}>
          {children}
        </Suspense>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

/* ============================
   ローディング UI（Astrodex 風）
   ============================ */
function PageFallback() {
  return (
    <div className="w-full flex justify-center items-center py-20 text-gray-400">
      Loading...
    </div>
  );
}
