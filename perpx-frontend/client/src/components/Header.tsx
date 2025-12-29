import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  Check,
  MessageSquare,
  Shield,
  FileText,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";


import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";
import { useAccount } from "@/contexts/AccountContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";




export default function Header() {
  // ======================
  // State
  // ======================
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const [location] = useLocation();

    useEffect(() => {
    setMobileMenuOpen(false);
    setIsLanguageOpen(false);
    setIsMoreOpen(false);
    setIsMobileMoreOpen(false);
  }, [location]);


  // ======================
  // Contexts
  // ======================
  const { language, setLanguage, t } = useLanguage();
  const { address, isConnected, connect, disconnect } = useWallet();
  const { balance, isLoadingBalance, isDepositing, deposit } = useAccount();

  // ======================
  // Page flags
  // ======================
  const isHomePage = location === "/";
  const isLegalPage =
    location.startsWith("/privacy") || location.startsWith("/terms");

  // ======================
  // Language
  // ======================
  const languageNames = {
    en: "English",
    jp: "日本語",
    cn: "中文",
  };

  // ======================
  // More menu
  // ======================
  const moreItems = [
    {
      icon: MessageSquare,
      titleKey: "more.feedback",
      descKey: "more.feedbackDesc",
      href: "/feedback",
    },
    {
      icon: Shield,
      titleKey: "more.vip",
      descKey: "more.vipDesc",
      href: "/vip",
    },
    {
      icon: FileText,
      titleKey: "more.api",
      descKey: "more.apiDesc",
      href: "/api",
    },
    {
      icon: BookOpen,
      titleKey: "more.documentation",
      descKey: "more.documentationDesc",
      href: "/docs",
    },
    {
      icon: FileText,
      titleKey: "more.blog",
      descKey: "more.blogDesc",
      href: "/blog",
    },
    {
      icon: MessageCircle,
      titleKey: "more.discord",
      descKey: "more.discordDesc",
      href: "https://discord.gg/perpx",
      external: true,
    },
  ];

  // ======================
  // Handlers
  // ======================
  const handleDeposit = async () => {
    try {
      await deposit(depositAmount);
      setDepositAmount("");
    } catch (e) {
      console.error(e);
    }
  };

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // ======================
  // Render
  // ======================
  return (
    <nav
  className="border-b border-white/10 bg-card/30 backdrop-blur-sm sticky top-0 z-50"
  style={{ pointerEvents: "auto" }}
>

      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* ================= Left ================= */}
          <div className="flex items-center gap-3">
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

            <Link href="/" className="flex items-center gap-2">
              <img src="/perpx-icon.png" alt="PerpX" className="h-6 w-6" />
              <span className="text-lg font-bold text-white">PerpX</span>
            </Link>
          </div>

          {/* ================= Right ================= */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Balance */}
            {isConnected && (
              <div className="hidden sm:block text-xs text-white/70 mr-2">
                Balance:{" "}
                {isLoadingBalance
                  ? "..."
                  : `${Number(balance).toFixed(2)} tUSD`}
              </div>
            )}

            {/* Mini Deposit */}
            {isConnected && (
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-24 text-xs"
                  disabled={isDepositing}
                />
                <Button
                  size="sm"
                  onClick={handleDeposit}
                  disabled={isDepositing}
                >
                  {isDepositing ? "..." : "Deposit"}
                </Button>
              </div>
            )}

            {/* Wallet */}
            {(isHomePage || isLegalPage) ? (
              <Link
                href="/trade"
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs sm:text-sm font-medium"
              >
                {t("button.launchApp")}
              </Link>
            ) : !isConnected ? (
              <Button onClick={connect}>
                {t("button.connectWallet")}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs">
                  {address ? formatAddress(address) : ""}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={disconnect}
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
