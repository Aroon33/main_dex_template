"use client";

import Link from "next/link";
import Wallet from "@/src/components/Wallet";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-xl bg-black/30 
        border-b border-white/10 shadow-lg
        px-6 py-4 flex justify-between items-center
      "
    >
      {/* LOGO */}
      <div
        className="
          text-2xl font-extrabold 
          bg-gradient-to-r from-purple-400 to-blue-400 
          bg-clip-text text-transparent
        "
      >
        PerpX
      </div>

      {/* DESKTOP NAVIGATION */}
      <nav className="hidden md:flex gap-8 text-gray-300 font-medium">
        <NavItem href="/">Home</NavItem>
        <NavItem href="/trade">Trade</NavItem>
        <NavItem href="/dashboard">Dashboard</NavItem>
        <NavItem href="/wallet">Wallet</NavItem>
        <NavItem href="/stake">Stake</NavItem>
      </nav>

      {/* WALLET SECTION (Desktop) */}
      <div className="hidden md:block">
        <Wallet />
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden text-gray-300 text-3xl"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* MOBILE MENU DROPDOWN */}
      {open && (
        <div
          className="
            absolute top-full right-4 mt-2
            bg-black/60 backdrop-blur-xl 
            border border-white/10 
            rounded-xl shadow-xl
            flex flex-col text-right p-4 space-y-3 md:hidden
          "
        >
          <NavItem href="/">Home</NavItem>
          <NavItem href="/trade">Trade</NavItem>
          <NavItem href="/dashboard">Dashboard</NavItem>
          <NavItem href="/wallet">Wallet</NavItem>
          <NavItem href="/stake">Stake</NavItem>

          <div className="pt-3 border-t border-white/10">
            <Wallet />
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="
        nav-item
        text-gray-300 hover:text-white 
        transition font-medium
      "
    >
      {children}
    </Link>
  );
}
