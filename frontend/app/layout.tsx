// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Providers from "@/src/components/Providers";
import Header from "@/src/components/Header";  // ← Header をインポート

export const metadata = {
  title: "PerpX Exchange",
  description: "Decentralized Perpetual Trading Platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-[#070709] to-[#000000] text-white min-h-screen">

        <Providers>
          {/* HEADER（常に上部固定） */}
          <Header />

          {/* PAGE WRAPPER */}
          <div className="pt-24 px-4 md:px-8 pb-10">
            <main>{children}</main>
          </div>
        </Providers>

      </body>
    </html>
  );
}
