import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import TradingViewChart from "../components/TradingViewChart";



const markets = [
  { symbol: "BTCUSDT", price: "111,062.6", change: "+3.17%", positive: true },
  { symbol: "ETHUSDT", price: "4,030.1", change: "+2.76%", positive: true },
  { symbol: "SOLUSDT", price: "191.91", change: "+1.56%", positive: true },
  { symbol: "XRPUSDT", price: "2.4491", change: "+3.21%", positive: true },
  { symbol: "DOGEUSDT", price: "0.2006", change: "+3.53%", positive: true },
];

const orderBookAsks = [
  { price: "111,073.6", size: "1,110.8", sum: "4,116,250.1" },
  { price: "111,073.5", size: "165,355.9", sum: "4,115,139.3" },
  { price: "111,073.1", size: "89,969.3", sum: "3,952,083.4" },
  { price: "111,072.9", size: "111.1", sum: "3,862,114.1" },
  { price: "111,071.6", size: "84,969.8", sum: "3,862,003.0" },
];

const orderBookBids = [
  { price: "111,062.6", size: "111,063.0", sum: "" },
  { price: "111,062.6", size: "1,388,504.7", sum: "1,388,504.7" },
  { price: "111,057.2", size: "141,486.9", sum: "1,529,991.6" },
  { price: "111,056.9", size: "68,189.0", sum: "1,598,180.6" },
  { price: "111,056.7", size: "68,188.9", sum: "1,666,369.5" },
];

export default function Trade() {
  const [tradeMode, setTradeMode] = useState<"perpetual" | "spot">("perpetual");
  const [orderType, setOrderType] = useState("Market");
  const [marginType, setMarginType] = useState("Cross");
  const [leverage, setLeverage] = useState("25x");

  // ===== Event-driven states =====
const [positions, setPositions] = useState<any[]>([]);
const [tradeHistory, setTradeHistory] = useState<any[]>([]);
const [transactions, setTransactions] = useState<any[]>([]);
const [orders, setOrders] = useState<any[]>([]);

 
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Trade Mode Tabs */}
      <div className="border-b border-white/10 bg-card">
        <div className="px-3 sm:px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTradeMode("perpetual")}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                tradeMode === "perpetual"
                  ? "border-primary text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              Perpetual
            </button>
            <button
              onClick={() => setTradeMode("spot")}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                tradeMode === "spot"
                  ? "border-primary text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              Spot
            </button>
          </div>
        </div>
      </div>

      {tradeMode === "perpetual" ? (
        <>
          {/* Market Info Bar */}
          <div className="border-b border-white/10 bg-card">
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">BTCUSDT</span>
                    <ChevronDown className="h-4 w-4 text-white/60" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-lg font-bold text-white">111,062.6</div>
                    <div className="text-xs text-green-500">+3.17%</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Mark</div>
                    <div className="text-sm text-white">111,063.0</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Index</div>
                    <div className="text-sm text-white">111,091.0</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Funding/Countdown</div>
                    <div className="text-sm text-white">0.0100% / 03:19:18</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">24h volume</div>
                    <div className="text-sm text-white">11.04B USDT</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Open Interest</div>
                    <div className="text-sm text-white">1.54B USDT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Trading Interface - Perpetual */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Left Sidebar - Markets */}
            <div className="hidden lg:block w-64 border-r border-white/10 bg-card overflow-y-auto">
              <div className="p-3">
                <Input
                  placeholder="Search"
                  className="mb-3 bg-background border-white/10 text-sm"
                />
                <div className="space-y-1">
                  {markets.map((market) => (
                    <button
                      key={market.symbol}
                      className="w-full p-2 hover:bg-white/5 rounded transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{market.symbol}</span>
                        <span className={`text-xs ${market.positive ? 'text-green-500' : 'text-red-500'}`}>
                          {market.change}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 mt-1">{market.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Chart Area */}
            <div className="flex-1 flex flex-col min-w-0">

              <div className="flex-1 bg-card border-b border-white/10 min-h-[300px] lg:min-h-[500px]">
                <TradingViewChart symbol="BINANCE:BTCUSDT" />

              </div>

        {/* ================================
           DATA TABS (重要)
           👉 Event データはここに表示する
        ================================ */}

              {/* Bottom Tabs - Positions, Orders, etc. */}
              <div className="h-48 lg:h-64 bg-card overflow-y-auto">
                <Tabs defaultValue="positions" className="h-full">
                  <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0">
                    <TabsTrigger value="positions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Positions</TabsTrigger>
                    <TabsTrigger value="open-orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Open orders</TabsTrigger>
                    <TabsTrigger value="order-history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Order history</TabsTrigger>
                    <TabsTrigger value="trade-history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Trade history</TabsTrigger>
                    <TabsTrigger value="transaction-history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Transaction history</TabsTrigger>
                    <TabsTrigger value="deposits" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Deposits & withdrawals</TabsTrigger>
                    <TabsTrigger value="assets" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Assets</TabsTrigger>
                  </TabsList>

                  <TabsContent value="transaction-history" className="p-4">
  <div className="text-sm text-white">
    Transaction history content here
  </div>
</TabsContent>


            {/* ================================
               POSITIONS TAB
               Event: PositionOpened / PartiallyClosed
            ================================ */}

            ③ ここに「Positions」を表示する（Event）

                  <TabsContent value="positions" className="p-4 space-y-2">
  {positions.length === 0 && (
    <div className="text-sm text-white/60">No open positions</div>
  )}

  {positions.map(p => (
    <Card key={p.id} className="p-3">
      <div className="font-medium">{p.symbol}</div>
      <div className="text-xs text-white/60">
        Opened: {new Date(p.openedAt).toLocaleString()}
      </div>
    </Card>
  ))}
</TabsContent>


            {/* ================================
               TRADE HISTORY TAB
               Event: PositionClosed / Liquidated
            ================================ */}
                  <TabsContent value="trade-history" className="p-4 space-y-2">
  {tradeHistory.map(t => (
    <Card key={t.id} className="p-3">
      <div className="flex justify-between">
        <div>{t.symbol} · {t.side}</div>
        <div className={t.pnl >= 0 ? "text-green-500" : "text-red-500"}>
          {t.pnl.toFixed(2)}
        </div>
      </div>
      <div className="text-xs text-white/60">
        {new Date(t.timestamp).toLocaleString()}
      </div>
    </Card>
  ))}
</TabsContent>

                </Tabs>
              </div>
            </div>

            {/* Right Sidebar - Order Book & Order Panel */}
            <div className="hidden xl:flex flex-col w-80 border-l border-white/10">
              {/* Order Book */}

              <div className="flex-1 bg-card overflow-y-auto">
                <Tabs defaultValue="order-book" className="h-full">
                  <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0">
                    <TabsTrigger value="order-book" className="rounded-none">Order book</TabsTrigger>
                    <TabsTrigger value="trades" className="rounded-none">Trades</TabsTrigger>
                  </TabsList>
                  <TabsContent value="order-book" className="p-3">
                    <div className="space-y-1">
                      <div className="grid grid-cols-3 gap-2 text-xs text-white/60 mb-2">
                        <div>Price (USDT)</div>
                        <div className="text-right">Size (USDT)</div>
                        <div className="text-right">Sum (USDT)</div>
                      </div>
                      
                      {orderBookAsks.map((ask, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-red-500">{ask.price}</div>
                          <div className="text-white/60 text-right">{ask.size}</div>
                          <div className="text-white/60 text-right">{ask.sum}</div>
                        </div>
                      ))}
                      <div className="text-lg font-bold text-white my-2">111,062.6 ↓</div>
                      {orderBookBids.map((bid, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-green-500">{bid.price}</div>
                          <div className="text-white/60 text-right">{bid.size}</div>
                          <div className="text-white/60 text-right">{bid.sum}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="trades" className="p-3">
                    <div className="text-sm text-white/60">Recent trades</div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Order Panel */}
              <div className="h-[500px] bg-card border-t border-white/10 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Margin Type & Leverage */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">{marginType}</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">{leverage}</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">M</Button>
                    </div>
                  </div>

                  {/* Order Type */}
                  <Tabs defaultValue="market" className="w-full">
                    <TabsList className="w-full bg-transparent border border-white/10 p-0">
                      <TabsTrigger value="market" className="flex-1 text-xs">Market</TabsTrigger>
                      <TabsTrigger value="limit" className="flex-1 text-xs">Limit</TabsTrigger>
                      <TabsTrigger value="stop-limit" className="flex-1 text-xs">Stop Limit</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Price */}
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Price (USDT)</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value="111073.6"
                        readOnly
                        className="flex-1 bg-background border-white/10 text-sm"
                      />
                      <span className="text-xs text-white/60">Mid</span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">USDT</Button>
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Size</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        className="flex-1 bg-background border-white/10 text-sm"
                      />
                      <Button variant="ghost" size="sm" className="h-7 text-xs">USDT</Button>
                    </div>
                  </div>

                  {/* Percentage Slider */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">0%</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">25%</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">50%</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">75%</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">100%</Button>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" className="rounded" />
                      <span className="text-white/60">TP/SL</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" className="rounded" />
                      <span className="text-white/60">Hidden Order</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" className="rounded" />
                      <span className="text-white/60">Reduce-Only</span>
                    </label>
                  </div>

                  {/* Info */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Liq.Price</span>
                      <span className="text-white">--</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Margin</span>
                      <span className="text-white">0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Max</span>
                      <span className="text-white">0.0 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Fees</span>
                      <span className="text-white">--</span>
                    </div>
                  </div>

                 

                  {/* Account Section */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm font-medium text-white mb-3">Account</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">Deposit</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">Withdraw</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">Transfer</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Order Panel - Only visible on small screens */}
          <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-card border-t-2 border-white/10 z-50 max-h-[60vh] overflow-y-auto">
            <div className="p-3 space-y-3">
              {/* Margin Type & Leverage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs">{marginType}</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs">{leverage}</Button>
                </div>
              </div>

              {/* Order Type Tabs */}
              <Tabs defaultValue="market" className="w-full">
                <TabsList className="w-full bg-transparent border border-white/10 p-0">
                  <TabsTrigger value="market" className="flex-1 text-xs">Market</TabsTrigger>
                  <TabsTrigger value="limit" className="flex-1 text-xs">Limit</TabsTrigger>
                  <TabsTrigger value="stop-limit" className="flex-1 text-xs">Stop Limit</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Price Input */}
              <div>
                <label className="text-xs text-white/60 mb-1 block">Price (USDT)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value="111073.6"
                    readOnly
                    className="flex-1 bg-background border-white/10 text-sm h-9"
                  />
                  <span className="text-xs text-white/60">Mid</span>
                </div>
              </div>

              {/* Size Input */}
              <div>
                <label className="text-xs text-white/60 mb-1 block">Size</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="0.00"
                    className="flex-1 bg-background border-white/10 text-sm h-9"
                  />
                  <span className="text-xs text-white/60">USDT</span>
                </div>
              </div>

              {/* Percentage Slider */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">0%</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">25%</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">50%</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">75%</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">100%</Button>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Margin</span>
                  <span className="text-white">0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Max</span>
                  <span className="text-white">0.0 USDT</span>
                </div>
              </div>

              {/* Buy/Sell Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-green-500 hover:bg-green-600 text-white h-10">Buy/Long</Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white h-10">Sell/Short</Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Spot Trading Interface */}
          <div className="border-b border-white/10 bg-card">
            <div className="px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">BTC/USDT</span>
                    <ChevronDown className="h-4 w-4 text-white/60" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-lg font-bold text-white">111,062.6</div>
                    <div className="text-xs text-green-500">+3.17%</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">24h High</div>
                    <div className="text-sm text-white">112,500.0</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">24h Low</div>
                    <div className="text-sm text-white">108,200.0</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">24h Volume (BTC)</div>
                    <div className="text-sm text-white">15,234.56</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60">24h Volume (USDT)</div>
                    <div className="text-sm text-white">1.69B</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Left Sidebar - Markets */}
            <div className="hidden lg:block w-64 border-r border-white/10 bg-card overflow-y-auto">
              <div className="p-3">
                <Input
                  placeholder="Search"
                  className="mb-3 bg-background border-white/10 text-sm"
                />
                <div className="space-y-1">
                  {markets.map((market) => (
                    <button
                      key={market.symbol}
                      className="w-full p-2 hover:bg-white/5 rounded transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{market.symbol.replace('USDT', '/USDT')}</span>
                        <span className={`text-xs ${market.positive ? 'text-green-500' : 'text-red-500'}`}>
                          {market.change}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 mt-1">{market.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Chart Area */}
            <div className="flex-1 flex flex-col min-w-0">

              <div className="flex-1 bg-card border-b border-white/10 min-h-[300px] lg:min-h-[500px]">
                {/* <TradingViewChart symbol="BINANCE:BTCUSDT" /> */}
              </div>

              {/* Bottom Tabs - Open Orders, Order History, etc. */}
              <div className="h-64 bg-card">
                <Tabs defaultValue="open-orders" className="h-full">
                  <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0">
                    <TabsTrigger value="open-orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Open Orders</TabsTrigger>
                    <TabsTrigger value="order-history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Order History</TabsTrigger>
                    <TabsTrigger value="trade-history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Trade History</TabsTrigger>
                    <TabsTrigger value="funds" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Funds</TabsTrigger>
                  </TabsList>
                  <TabsContent value="open-orders" className="p-4 space-y-2">
  {orders.map(o => (
    <Card key={o.id} className="p-3">
      <div>Close Requested</div>
      <div className="text-xs">
        Position #{o.positionId}
      </div>
    </Card>
  ))}
</TabsContent>

                  <TabsContent value="order-history" className="p-4">
                    <div className="text-sm text-white/60">No order history</div>
                  </TabsContent>
                  <TabsContent value="trade-history" className="p-4">
                    <div className="text-sm text-white/60">No trade history</div>
                  </TabsContent>
                  <TabsContent value="funds" className="p-4">
                    <div className="text-sm text-white/60">No funds</div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right Sidebar - Order Book & Spot Order Panel */}
            <div className="hidden xl:flex flex-col w-80 border-l border-white/10">
              {/* Order Book */}
              <div className="flex-1 bg-card overflow-y-auto">
                <Tabs defaultValue="order-book" className="h-full">
                  <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0">
                    <TabsTrigger value="order-book" className="rounded-none">Order book</TabsTrigger>
                    <TabsTrigger value="trades" className="rounded-none">Trades</TabsTrigger>
                  </TabsList>
                  <TabsContent value="order-book" className="p-3">
                    <div className="space-y-1">
                      <div className="grid grid-cols-3 gap-2 text-xs text-white/60 mb-2">
                        <div>Price (USDT)</div>
                        <div className="text-right">Amount (BTC)</div>
                        <div className="text-right">Total (USDT)</div>
                      </div>
                      {orderBookAsks.map((ask, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-red-500">{ask.price}</div>
                          <div className="text-white/60 text-right">{(parseFloat(ask.size.replace(/,/g, '')) / 111073).toFixed(4)}</div>
                          <div className="text-white/60 text-right">{ask.sum}</div>
                        </div>
                      ))}
                      <div className="text-lg font-bold text-white my-2">111,062.6 ↓</div>
                      {orderBookBids.map((bid, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-green-500">{bid.price}</div>
                          <div className="text-white/60 text-right">{bid.size ? (parseFloat(bid.size.replace(/,/g, '')) / 111062).toFixed(4) : '--'}</div>
                          <div className="text-white/60 text-right">{bid.sum}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="trades" className="p-3">
                    <div className="text-sm text-white/60">Recent trades</div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Spot Order Panel */}
              <div className="h-[500px] bg-card border-t border-white/10 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Buy/Sell Tabs */}
                  <Tabs defaultValue="buy" className="w-full">
                    <TabsList className="w-full bg-transparent border border-white/10 p-0">
                      <TabsTrigger value="buy" className="flex-1 text-xs data-[state=active]:bg-green-500/20">Buy</TabsTrigger>
                      <TabsTrigger value="sell" className="flex-1 text-xs data-[state=active]:bg-red-500/20">Sell</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Order Type */}
                  <Tabs defaultValue="limit" className="w-full">
                    <TabsList className="w-full bg-transparent border border-white/10 p-0">
                      <TabsTrigger value="limit" className="flex-1 text-xs">Limit</TabsTrigger>
                      <TabsTrigger value="market" className="flex-1 text-xs">Market</TabsTrigger>
                      <TabsTrigger value="stop-limit" className="flex-1 text-xs">Stop-Limit</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Price */}
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Price</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value="111073.6"
                        readOnly
                        className="flex-1 bg-background border-white/10 text-sm"
                      />
                      <span className="text-xs text-white/60">USDT</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Amount</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        className="flex-1 bg-background border-white/10 text-sm"
                      />
                      <span className="text-xs text-white/60">BTC</span>
                    </div>
                  </div>

                  {/* Percentage Slider */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">0%</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">25%</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">50%</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">75%</Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">100%</Button>
                  </div>

                  {/* Total */}
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Total</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        className="flex-1 bg-background border-white/10 text-sm"
                      />
                      <span className="text-xs text-white/60">USDT</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Available</span>
                      <span className="text-white">0.00 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Fee</span>
                      <span className="text-white">0.1%</span>
                    </div>
                  </div>

                  {/* Buy/Sell Button */}
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Buy BTC
                  </Button>

                  {/* Account Section */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm font-medium text-white mb-3">Account</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">Deposit</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">Withdraw</Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">Transfer</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Order Panel for Spot - Only visible on small screens */}
          <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-card border-t-2 border-white/10 z-50 max-h-[60vh] overflow-y-auto">
            <div className="p-3 space-y-3">
              {/* Buy/Sell Tabs */}
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="w-full bg-transparent border border-white/10 p-0">
                  <TabsTrigger value="buy" className="flex-1 text-xs data-[state=active]:bg-green-500/20">Buy</TabsTrigger>
                  <TabsTrigger value="sell" className="flex-1 text-xs data-[state=active]:bg-red-500/20">Sell</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Order Type */}
              <Tabs defaultValue="limit" className="w-full">
                <TabsList className="w-full bg-transparent border border-white/10 p-0">
                  <TabsTrigger value="limit" className="flex-1 text-xs">Limit</TabsTrigger>
                  <TabsTrigger value="market" className="flex-1 text-xs">Market</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Price */}
              <div>
                <label className="text-xs text-white/60 mb-1 block">Price</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value="111073.6"
                    readOnly
                    className="flex-1 bg-background border-white/10 text-sm h-9"
                  />
                  <span className="text-xs text-white/60">USDT</span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs text-white/60 mb-1 block">Amount</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="0.00"
                    className="flex-1 bg-background border-white/10 text-sm h-9"
                  />
                  <span className="text-xs text-white/60">BTC</span>
                </div>
              </div>

              {/* Percentage Slider */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">0%</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">25%</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">50%</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">75%</Button>
                <Button variant="ghost" size="sm" className="flex-1 h-7 text-xs">100%</Button>
              </div>

              {/* Total */}
              <div>
                <label className="text-xs text-white/60 mb-1 block">Total</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="0.00"
                    className="flex-1 bg-background border-white/10 text-sm h-9"
                  />
                  <span className="text-xs text-white/60">USDT</span>
                </div>
              </div>

              {/* Buy Button */}
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white h-10">
                Buy BTC
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
