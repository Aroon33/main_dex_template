import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DemoTradingProvider } from "./contexts/DemoTradingContext";
import { WalletProvider } from "./contexts/WalletContext";
import { AccountProvider } from "./contexts/AccountContext";

import AppLayout from "./layouts/AppLayout";

// Pages
import Home from "./pages/Home";
import Trade from "@/pages/Trade";
import TradeTab from "./pages/Tradetab"; // ← 履歴ページ
import Dashboard from "./pages/Dashboard";
import Points from "./pages/Points";
import Referral from "./pages/Referral";
import Stats from "./pages/Stats";
import Rewards from "./pages/Rewards";
import Stake from "./pages/Stake";
import Earn from "./pages/Earn";
import Airdrop from "./pages/Airdrop";
import Feedback from "./pages/Feedback";
import VIP from "./pages/VIP";
import API from "./pages/API";
import Docs from "./pages/Docs";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DevToolPanel from "./pages/DevToolPanel";


function Router() {
  return (
    <Switch>
      <Route path="/">
        <AppLayout>
          <Home />
        </AppLayout>
      </Route>

      {/* ===== Trade ===== */}
      <Route path="/trade">
        <AppLayout>
          <Trade />
        </AppLayout>
      </Route>

      {/* ===== Trade History ===== */}
      <Route path="/history">
        <AppLayout>
          <TradeTab />
        </AppLayout>
      </Route>

      {/* ===== Dev Tool ===== */}
      <Route path="/dev">
        <AppLayout>
          <DevToolPanel />
        </AppLayout>
      </Route>

      <Route path="/dashboard">
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </Route>

      <Route path="/points">
        <AppLayout>
          <Points />
        </AppLayout>
      </Route>

      <Route path="/referral">
        <AppLayout>
          <Referral />
        </AppLayout>
      </Route>

      <Route path="/stats">
        <AppLayout>
          <Stats />
        </AppLayout>
      </Route>

      <Route path="/rewards">
        <AppLayout>
          <Rewards />
        </AppLayout>
      </Route>

      <Route path="/stake">
        <AppLayout>
          <Stake />
        </AppLayout>
      </Route>

      <Route path="/earn">
        <AppLayout>
          <Earn />
        </AppLayout>
      </Route>

      <Route path="/airdrop">
        <AppLayout>
          <Airdrop />
        </AppLayout>
      </Route>

      <Route path="/feedback">
        <AppLayout>
          <Feedback />
        </AppLayout>
      </Route>

      <Route path="/vip">
        <AppLayout>
          <VIP />
        </AppLayout>
      </Route>

      <Route path="/api">
        <AppLayout>
          <API />
        </AppLayout>
      </Route>

      <Route path="/docs">
        <AppLayout>
          <Docs />
        </AppLayout>
      </Route>

      <Route path="/blog">
        <AppLayout>
          <Blog />
        </AppLayout>
      </Route>

      <Route path="/privacy-policy">
        <AppLayout>
          <PrivacyPolicy />
        </AppLayout>
      </Route>

      <Route path="/terms-of-service">
        <AppLayout>
          <TermsOfService />
        </AppLayout>
      </Route>

      {/* ===== 404 ===== */}
      <Route path="/404">
  <NotFound />
</Route>

    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <WalletProvider>
            <AccountProvider>
              <DemoTradingProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </DemoTradingProvider>
            </AccountProvider>
          </WalletProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
