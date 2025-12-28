import { Link, useLocation } from "wouter";
import { Menu, X, Globe, ChevronDown, Check, MessageSquare, Award, Shield, FileText, BookOpen, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWallet } from "@/contexts/WalletContext";


import { ethers } from "ethers";
import { deposit } from "@/lib/eth/deposit";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { address, isConnected, connect, disconnect } = useWallet();

  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);

  const isHomePage = location === "/";
  const isLegalPage =
  location.startsWith("/privacy") || location.startsWith("/terms");


  const languageNames = {
    en: 'English',
    jp: '日本語',
    cn: '中文'
  };

  const moreItems = [
    { icon: MessageSquare, titleKey: 'more.feedback', descKey: 'more.feedbackDesc', href: '/feedback' },
    { icon: Shield, titleKey: 'more.vip', descKey: 'more.vipDesc', href: '/vip' },
    { icon: FileText, titleKey: 'more.api', descKey: 'more.apiDesc', href: '/api' },
    { icon: BookOpen, titleKey: 'more.documentation', descKey: 'more.documentationDesc', href: '/docs' },
    { icon: FileText, titleKey: 'more.blog', descKey: 'more.blogDesc', href: '/blog' },
    { icon: MessageCircle, titleKey: 'more.discord', descKey: 'more.discordDesc', href: 'https://discord.gg/perpx', external: true },
  ];

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
    // toast.error("Deposit failed");
  } finally {
    setDepositLoading(false);
  }
};



  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
  <>
    {/* 🔴 DEBUG: Header is rendered */}
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        background: "red",
        color: "white",
        fontSize: 12,
        padding: "4px 6px",
      }}
    >
      HEADER DEBUG
    </div>

    {/* Top Navigation */}
    <nav className="border-b border-white/10 bg-card/30 backdrop-blur-sm sticky top-0 z-50">

        <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {!isLegalPage && (
                <button
                  className="lg:hidden p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}
              <Link href="/" className="flex items-center gap-2">
                <img src="/perpx-icon.png" alt="PerpX" className="h-6 w-6" />
                <span className="text-lg sm:text-xl font-bold text-white">PerpX</span>
              </Link>
              {!isHomePage && !isLegalPage && (
                <div className="hidden lg:flex items-center gap-4 sm:gap-6 ml-4 sm:ml-8">
                  <Link href="/trade" className={`text-xs sm:text-sm transition-colors ${
                      location === "/trade" ? "text-white" : "text-white/60 hover:text-white"
                    }`}>
                    {t('nav.perpetual')}
                  </Link>
                  <Link href="/dashboard" className={`text-xs sm:text-sm transition-colors ${
                      location === "/dashboard" ? "text-white" : "text-white/60 hover:text-white"
                    }`}>
                    {t('nav.portfolio')}
                  </Link>
                  <Link href="/referral" className={`text-xs sm:text-sm transition-colors ${
                      location === "/referral" ? "text-white" : "text-white/60 hover:text-white"
                    }`}>
                    {t('nav.referral')}
                  </Link>
                  <Link href="/rewards" className={`text-xs sm:text-sm transition-colors ${
                      location === "/rewards" ? "text-white" : "text-white/60 hover:text-white"
                    }`}>
                    {t('nav.rewards')}
                  </Link>
                  <Link href="/earn" className={`text-xs sm:text-sm transition-colors ${
                      location === "/earn" ? "text-white" : "text-white/60 hover:text-white"
                    }`}>
                    {t('nav.earn')}
                  </Link>
                  <Link href="/stake" className={`text-xs sm:text-sm transition-colors ${
                      location === "/stake" ? "text-white" : "text-white/60 hover:text-white"
                    }`}>
                    {t('nav.stake')}
                  </Link>
                  <Link href="/stats" className={`text-xs sm:text-sm transition-colors ${
                      location === "/stats" ? "text-white" : "text-white/60 hover:text-white"
                    }`}>
                    {t('nav.stats')}
                  </Link>
                  
                  {/* More Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsMoreOpen(!isMoreOpen)}
                      className="flex items-center gap-1 text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {t('more')}
                      <ChevronDown className={`h-4 w-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isMoreOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setIsMoreOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-72 bg-card/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl z-20">
                          <div className="p-2">
                            {moreItems.map((item) => {
                              const Icon = item.icon;
                              if (item.external) {
                                return (
                                  <a
                                    key={item.titleKey}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                                  >
                                    <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="text-sm font-medium text-white">{t(item.titleKey)}</div>
                                      <div className="text-xs text-white/60 mt-0.5">{t(item.descKey)}</div>
                                    </div>
                                  </a>
                                );
                              }
                              return (
                                <Link
                                  key={item.titleKey}
                                  href={item.href}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                                  onClick={() => setIsMoreOpen(false)}
                                >
                                  <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="text-sm font-medium text-white">{t(item.titleKey)}</div>
                                    <div className="text-xs text-white/60 mt-0.5">{t(item.descKey)}</div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
  {/* Language Selector */}
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
            {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map(
              (code) => (
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
              )
            )}
          </div>
        </div>
      </>
    )}
  </div>

  {/* ✅ Mini Deposit UI */}
  {isConnected && (
    <div className="flex items-center gap-2">
      <Input
        type="number"
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

  {/* Wallet / Connect */}
  {(isHomePage || isLegalPage) ? (
    <Link
      href="/trade"
      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
    >
      {t("button.launchApp")}
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
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && !isLegalPage && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center gap-2">
                <img src="/perpx-icon.png" alt="PerpX" className="h-6 w-6" />
                <span className="text-xl font-bold text-white">PerpX</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-2">
              {!isHomePage && (
                <>
                  <Link
                    href="/trade"
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.perpetual')}
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.portfolio')}
                  </Link>
                  <Link
                    href="/referral"
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.referral')}
                  </Link>
                  <Link
                    href="/rewards"
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.rewards')}
                  </Link>
                  <Link
                    href="/earn"
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.earn')}
                  </Link>
                  <Link
                    href="/stake"
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.stake')}
                  </Link>
                  <Link
                    href="/stats"
                    className="block px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.stats')}
                  </Link>

                  {/* More Section in Mobile */}
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <button
                      onClick={() => setIsMobileMoreOpen(!isMobileMoreOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <span>{t('more')}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isMobileMoreOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileMoreOpen && (
                      <div className="pl-4 space-y-1 mt-1">
                        {moreItems.map((item) => {
                          const Icon = item.icon;
                          if (item.external) {
                            return (
                              <a
                                key={item.titleKey}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                <Icon className="h-4 w-4 text-primary" />
                                <span className="text-sm">{t(item.titleKey)}</span>
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={item.titleKey}
                              href={item.href}
                              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setIsMobileMoreOpen(false);
                              }}
                            >
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="text-sm">{t(item.titleKey)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
