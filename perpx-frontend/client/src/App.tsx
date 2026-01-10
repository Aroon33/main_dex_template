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

import TradeAdmin from "@/pages/TradeAdmin";



function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/trade" component={Trade} />
        <Route path="/trade/admin" component={TradeAdmin} />
        <Route path="/dev" component={DevToolPanel} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/points" component={Points} />
        <Route path="/referral" component={Referral} />
        <Route path="/stats" component={Stats} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/stake" component={Stake} />
        <Route path="/earn" component={Earn} />
        <Route path="/airdrop" component={Airdrop} />
        <Route path="/feedback" component={Feedback} />
        <Route path="/vip" component={VIP} />
        <Route path="/api" component={API} />
        <Route path="/docs" component={Docs} />
        <Route path="/blog" component={Blog} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />

        {/* 404 */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </AppLayout>
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
