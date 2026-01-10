import "./globals.css";
import { ReactNode } from "react";
import Providers from "@/src/components/Providers";
import Header from "@/src/components/Header";

export const metadata = {
  title: "PerpX Exchange",
  description: "Decentralized Perpetual Trading Platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="app-root">
          <Providers>
            
            {/* */}

            {/* Page Content */}
            <div className="pt-24 px-4 md:px-8 pb-10">
              <main>{children}</main>
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
