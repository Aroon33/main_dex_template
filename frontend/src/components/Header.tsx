"use client";

import Link from "next/link";
import { useState } from "react";
import Wallet from "@/src/components/Wallet";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const closeAll = () => {
    setOpen(false);
    setMoreOpen(false);
  };

  const Item = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={closeAll}
      className="block py-1"
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0B0E11]/90 backdrop-blur border-b border-white/10">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-white">
          PerpX
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center space-x-3">
          {/* CONNECT WALLET (常時表示) */}
          <Wallet />

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-4 py-4 bg-[#0B0E11] border-t border-white/10 text-white/80 text-sm">

          {/* MAIN */}
          <div className="flex flex-col space-y-2">
            <Item href="/" label="Home" />
            <Item href="/trade" label="Trade" />
            <Item href="/dashboard" label="Dashboard" />
            <Item href="/wallet" label="Wallet" />
            <Item href="/stake" label="Stake" />
            <Item href="/vip" label="VIP" />
          </div>

          <div className="border-t border-white/10 my-3" />

          {/* MORE */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex justify-between w-full py-2"
          >
            <span>More</span>
            <span>{moreOpen ? "−" : "+"}</span>
          </button>

          {moreOpen && (
            <div className="flex flex-col space-y-2 pl-3 text-white/70">
              <Item href="/earn" label="Earn" />
              <Item href="/rewards" label="Rewards" />
              <Item href="/points" label="Points" />
              <Item href="/stats" label="Stats" />
              <Item href="/airdrop" label="Airdrop" />
              <Item href="/docs" label="Docs" />
              <Item href="/blog" label="Blog" />
              <Item href="/api" label="API" />
              <Item href="/feedback" label="Feedback" />
              <Item href="/privacy-policy" label="Privacy" />
              <Item href="/terms" label="Terms" />
              <Item href="/referral" label="Referral" />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
