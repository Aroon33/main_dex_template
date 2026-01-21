/**
 * =====================================================
 * Unified Header Component (FINAL – BUILD SAFE)
 * =====================================================
 */

import { Link, useLocation } from "wouter";
import { Menu, X, Globe, Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";
import { useAccount } from "@/contexts/AccountContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  /* ======================
     State
  ====================== */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  type WalletTab = "deposit" | "withdraw";
  const [walletTab, setWalletTab] = useState<WalletTab>("deposit");

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [location] = useLocation();

  /* ======================
     Contexts
  ====================== */
  const { language, setLanguage, t } = useLanguage();
  const { address, isConnected, connect, disconnect } = useWallet();
  const {
  availableBalance,
  walletTokenBalance,
  deposit,
  withdraw,
  isDepositing,
  isWithdrawing,
} = useAccount();


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
      await deposit(depositAmount);
      setDepositAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    if (!address) return;

    try {
      await withdraw(withdrawAmount);
      setWithdrawAmount("");
    } catch (e) {
      console.error(e);
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
                  <img src="/perpx-icon.png" alt="PerpX" className="h-6 w-6" />
                  <span className="text-lg sm:text-xl font-bold text-white">
                    PerpX
                  </span>
                </a>
              </Link>

              <div className="hidden lg:flex items-center gap-4 ml-6">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={`text-sm font-medium ${
                        location === item.href
                          ? "text-primary"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </a>
                  </Link>
                ))}

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
                      <div className="absolute right-0 mt-2 w-56 bg-card/95 border border-white/10 rounded-lg z-20">
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
                  className="p-2 hover:bg-white/5 rounded-lg"
                >
                  <Globe className="h-5 w-5" />
                </button>

                {isLanguageOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsLanguageOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-card/95 border border-white/10 rounded-lg z-20">
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
                            className="w-full flex justify-between px-3 py-2 text-sm hover:bg-white/5"
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

              {/* Wallet */}
              {(isHomePage || isLegalPage) ? (
                <Link href="/trade">
                  <a className="px-4 py-2 bg-primary text-white rounded-lg text-sm">
                    {t("button.launchApp")}
                  </a>
                </Link>
              ) : !isConnected ? (
                <button
                  onClick={connect}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
                >
                  {t("button.connectWallet")}
                </button>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsWalletOpen(!isWalletOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                  >
                    🦊 {formatAddress(address!)}
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </button>

                  {isWalletOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsWalletOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-card/95 border border-white/10 rounded-lg z-20 p-3 space-y-3">
                        <div className="text-xs text-white/60">Wallet</div>
                        <div className="text-sm break-all">{address}</div>

                        <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
  <div className="text-xs text-white/60">
    {walletTab === "deposit" ? "Wallet Balance" : "Available Balance"}
  </div>
  <div className="text-sm font-medium text-white">
    {walletTab === "deposit"
      ? walletTokenBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : availableBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}{" "}
    USDT
  </div>
</div>


                        {/* Tabs */}
                        <div className="flex border border-white/10 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setWalletTab("deposit")}
                            className={`flex-1 py-2 text-xs ${
                              walletTab === "deposit"
                                ? "bg-primary text-white"
                                : "text-white/60"
                            }`}
                          >
                            Deposit
                          </button>
                          <button
                            onClick={() => setWalletTab("withdraw")}
                            className={`flex-1 py-2 text-xs ${
                              walletTab === "withdraw"
                                ? "bg-primary text-white"
                                : "text-white/60"
                            }`}
                          >
                            Withdraw
                          </button>
                        </div>

                        {/* Amount */}
                        {walletTab === "deposit" ? (
                          <>
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={depositAmount}
                              onChange={(e) =>
                                setDepositAmount(e.target.value)
                              }
                              disabled={isDepositing}
                            />
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={handleDeposit}
                              disabled={isDepositing}
                            >
                              {isDepositing ? "Depositing..." : "Deposit"}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={withdrawAmount}
                              onChange={(e) =>
                                setWithdrawAmount(e.target.value)
                              }
                              disabled={isWithdrawing}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={handleWithdraw}
                              disabled={isWithdrawing}
                            >
                              {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                            </Button>
                          </>
                        )}

                        <div className="border-t border-white/10 pt-2">
                          <button
                            onClick={() => {
                              disconnect();
                              setIsWalletOpen(false);
                            }}
                            className="w-full text-left text-sm text-red-400"
                          >
                            Disconnect
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= Mobile Menu ================= */}
      {mobileMenuOpen && !isLegalPage && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95">
          <div className="p-4">
            <div className="flex justify-between mb-6">
              <Link href="/">
                <a className="flex gap-2">
                  <img src="/perpx-icon.png" className="h-6 w-6" />
                  <span className="text-xl font-bold">PerpX</span>
                </a>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a className="text-lg">{item.label}</a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
