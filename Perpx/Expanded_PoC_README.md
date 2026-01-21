PerpX – Expanded PoC README
Perpetual DEX / Architecture & Handover
0. この README の位置づけ（最重要）
この README は PerpX の現在の実装状態を正とする唯一のドキュメントです。
PoC 初期版ではありません
フルプロダクション最終形でもありません
「拡張 PoC（Expanded PoC / Pre-Production）」段階の仕様を定義します
仕様変更時は 必ずこの README を先に更新してください。
1. プロジェクト概要
PerpX は、
UI・価格・取引ロジック・資金管理を明確に分離した
モジュール型 Perpetual DEX です。
目的
UI を壊さずにロジックを進化させる
on-chain / off-chain を段階的に切り替えられる
外注・引き継ぎが容易な構造を維持する
2. 全体アーキテクチャ（現在）
User
 └─ Router (唯一の入口)
     ├─ PerpetualTrading (取引中核)
     │   ├─ FundingRate
     │   ├─ OrderBook
     │   └─ Libraries (Math / Position / Funding / Price)
     │
     ├─ LiquidityPool (資金管理)
     ├─ PriceOracle / ChainlinkOracle (価格)
     └─ LiquidationEngine (清算)
基本原則
User は Router 以外を直接呼ばない
Router は 入口・分岐のみ
重い計算・状態管理は Perpetual に集約
共通計算は Library に隔離
3. フロントエンド（Vite / SPA）
技術スタック（確定）
Build：Vite
SPA Router：wouter
UI：React + TypeScript + shadcn/ui
Web3：ethers v6
価格表示：Binance WebSocket（UI用）
重要な設計ルール
UI は PURE（表示専用）
provider / signer / contract は UI で触らない
すべての Web3 ロジックは hook 内で完結
hook は account?: string のみを受け取る
ディレクトリ（抜粋）
client/
├─ index.html
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ layouts/AppLayout.tsx
│  ├─ pages/          ← wouter 用 SPA ページ
│  ├─ hooks/
│  │  └─ trade/
│  │     ├─ read/     ← view / event / ws
│  │     └─ write/    ← open / close / claim
│  ├─ lib/eth/        ← ethers / ABI / low-level
│  └─ components/     ← PURE UI
ビルド出力（重要）
/perpx-frontend/dist/public
Web サーバーは このディレクトリを document root に設定する。
4. スマートコントラクト構成（現在）
contracts/
├─ core/             Router.sol
├─ perpetual/
│  ├─ PerpetualTrading.sol
│  ├─ FundingRate.sol
│  └─ OrderBook.sol
├─ liquidity/        LiquidityPool.sol
├─ liquidation/      LiquidationEngine.sol
├─ oracle/           PriceOracle / ChainlinkOracle
├─ tokens/           PLP.sol
├─ interfaces/       IPerp / IFundingRate / IOrderBook ...
└─ libraries/        Math / Position / Funding / Price
役割の再定義（重要）
モジュール	役割
Router	Entry Point + 軽い分岐
PerpetualTrading	状態管理・PnL・取引中核
FundingRate	資金調整ロジック（段階実装）
OrderBook	on-chain 注文管理（将来用）
LiquidityPool	実体資金の金庫
Oracle	価格取得のみ
Libraries	数学・共通計算
Router は「ロジックを持たない」ではなく
「重い計算を持たない」
5. Pair / Oracle 管理（SSOT）
SSOT 定義
項目	SSOT
ペア一覧	フロント（pairsStore / localStorage）
表示名 / ON-OFF	フロント
価格	Oracle（on-chain）
取引ロジック	Perpetual / Router
Oracle レイヤ
PriceOracle：手動 / fallback
ChainlinkOracle：自動価格
Oracle は ペアの存在を知らない
6. 現在の実装フェーズ
実装済み
deposit / withdraw
openPosition
closePosition（フル）
positionId 複数管理
フロント Position / History 表示
ChainlinkOracle 実装
未接続（意図的）
FundingRate フロント接続
on-chain OrderBook UI 接続
Indexer / API / Keeper
7. やってはいけないこと（重要）
❌ UI で provider / signer を生成
❌ Context を hook から直接読む
❌ Router に重い計算を足す
❌ Oracle にペア一覧を持たせる
❌ Next.js 前提の設計に戻す
8. 今後の進化パス（想定）
Funding / OrderBook hook 接続
Indexer 導入（read を off-chain 化）
API / Keeper / Risk Engine 追加
フルプロダクション移行
9. 一言まとめ（更新版）
PerpX は
UI・価格・取引・資金を分離した
拡張可能な Perpetual DEX 基盤である