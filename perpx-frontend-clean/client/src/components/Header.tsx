/**
 * =====================================================
 * Unified Header Component (FINAL – BUILD SAFE)
 * =====================================================
 */

import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Globe,
  Check,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { ethers } from "ethers";

import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";

import { deposit } from "@/lib/eth/deposit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  /* ======================
     State
  ====================== */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);

  const [location] = useLocation();

  /* ======================
     Contexts
  ====================== */
  const { language, setLanguage, t } = useLanguage();
  const { address, isConnected, connect, disconnect } = useWallet();

  /* ======================
     Page Flags
  ====================== */
  const isHomePage = location === "/";
  const isLegalPage =
    location.startsWith("/privacy") || location.startsWith("/terms");

  /* ======================
     Navigation
  ====================== */
  const navItems = [
    { label: "Perpetual", href: "/trade" },
    { label: "Portfolio", href: "/dashboard" },
    { label: "Referral", href: "/referral" },
    { label: "Rewards", href: "/rewards" },
    { label: "Earn", href: "/earn" },
    { label: "Stake", href: "/stake" },
    { label: "Stats", href: "/stats" },
  ];

  const moreItems = [
    { label: "Trade Admin", href: "/trade/admin" },
    { label: "Admin Feeds", href: "/admin/feeds" },
    { label: "Admin Pairs", href: "/admin/pairs" },
    { label: "Admin Pricing", href: "/admin/pricing" },
    { label: "Feedback", href: "/feedback" },
    { label: "VIP", href: "/vip" },
    { label: "API", href: "/api" },
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    {
      label: "Discord",
      href: "https://discord.gg/perpx",
      external: true,
    },
  ];

  /* ======================
     Language
  ====================== */
  const languageNames = {
    en: "English",
    jp: "日本語",
    cn: "中文",
  };

  /* ======================
     Handlers
  ====================== */
  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) return;
    if (!address) return;

    try {
      setDepositLoading(true);
      const amount = ethers.parseEther(depositAmount);
      await deposit(amount);
      setDepositAmount("");
    } catch (e) {
      console.error(e);
    } finally {
      setDepositLoading(false);
    }
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  /* ======================
     Render
  ====================== */
  return (
    <>
      {/* ================= Desktop Header ================= */}
      <nav className="border-b border-white/10 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* ===== Left ===== */}
            <div className="flex items-center gap-2 sm:gap-4">
              {!isLegalPage && (
                <button
                  className="lg:hidden p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              )}

              <Link href="/">
                <a className="flex items-center gap-2">
                  <img
                    src="/perpx-icon.png"
                    alt="PerpX"
                    className="h-6 w-6"
                  />
                  <span className="text-lg sm:text-xl font-bold text-white">
                    PerpX
                  </span>
                </a>
              </Link>

              {/* ===== Navigation (Desktop) ===== */}
              <div className="hidden lg:flex items-center gap-4 ml-6">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={`text-sm font-medium transition-colors ${
                        location === item.href
                          ? "text-primary"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}

                {/* MORE */}
                <div className="relative">
                  <button
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className="text-sm font-medium text-white/70 hover:text-white flex items-center gap-1"
                  >
                    More <ChevronDown className="h-4 w-4" />
                  </button>

                  {isMoreOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsMoreOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-20">
                        {moreItems.map((item) =>
                          item.external ? (
                            <a
                              key={item.label}
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                              className="block px-4 py-2 text-sm hover:bg-white/5"
                            >
                              {item.label}
                            </a>
                          ) : (
                            <Link key={item.label} href={item.href}>
                              <a
                                onClick={() => setIsMoreOpen(false)}
                                className="block px-4 py-2 text-sm hover:bg-white/5"
                              >
                                {item.label}
                              </a>
                            </Link>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ===== Right ===== */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {isLanguageOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsLanguageOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-card/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-20">
                      <div className="p-2">
                        {(Object.keys(languageNames) as Array<
                          keyof typeof languageNames
                        >).map((code) => (
                          <button
                            key={code}
                            onClick={() => {
                              setLanguage(code);
                              setIsLanguageOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm"
                          >
                            <span>{languageNames[code]}</span>
                            {language === code && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Deposit */}
              {isConnected && (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-24 text-xs"
                    disabled={depositLoading}
                  />
                  <Button
                    size="sm"
                    onClick={handleDeposit}
                    disabled={depositLoading}
                  >
                    {depositLoading ? "..." : "Deposit"}
                  </Button>
                </div>
              )}

              {/* Wallet */}
              {(isHomePage || isLegalPage) ? (
                <Link href="/trade">
                  <a className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap">
                    {t("button.launchApp")}
                  </a>
                </Link>
              ) : !isConnected ? (
                <button
                  onClick={connect}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  {t("button.connectWallet")}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm whitespace-nowrap">
                    {address ? formatAddress(address) : ""}
                  </div>
                  <button
                    onClick={disconnect}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= Mobile Menu ================= */}
      {mobileMenuOpen && !isLegalPage && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <Link href="/">
                <a className="flex items-center gap-2">
                  <img
                    src="/perpx-icon.png"
                    alt="PerpX"
                    className="h-6 w-6"
                  />
                  <span className="text-xl font-bold text-white">
                    PerpX
                  </span>
                </a>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-white/80 hover:text-white"
                  >
                    {item.label}
                  </a>
                </Link>
              ))}

              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="text-xs text-white/50 mb-2">MORE</div>
                {moreItems.map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block py-2 text-white/70 hover:text-white"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.label} href={item.href}>
                      <a
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-white/70 hover:text-white"
                      >
                        {item.label}
                      </a>
                    </Link>
                  )
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
