PerpX – ARCHITECTURE
Expanded PoC / Responsibility & File Mapping
0. 本ドキュメントの役割（最重要）
本ドキュメントは PerpX の「責務境界」と「ファイル対応」を固定するための資料である。
README.md：全体像・思想・ルール
ARCHITECTURE.md：責務・依存・配置の事実
TRADING_SPEC.md：数式・資金フロー・UX前提
👉 実装を触る前に必ず読むのは ARCHITECTURE.md
1. 全体アーキテクチャ（現在）
User
 └─ Router (Entry Point)
     ├─ PerpetualTrading (Core Brain)
     │   ├─ FundingRate
     │   ├─ OrderBook
     │   └─ Libraries
     │
     ├─ LiquidityPool (Vault)
     ├─ Oracle Layer
     │   ├─ ChainlinkOracle
     │   └─ PriceOracle
     └─ LiquidationEngine
基本原則
User は Router 以外を直接呼ばない
Router は 入口・分岐のみ
計算・状態・検証は Perpetual に集約
共通ロジックは Library に隔離
2. contracts ディレクトリ構成（確定）
contracts/
├─ core/
│  └─ Router.sol
│
├─ perpetual/
│  ├─ PerpetualTrading.sol
│  ├─ FundingRate.sol
│  └─ OrderBook.sol
│
├─ liquidity/
│  └─ LiquidityPool.sol
│
├─ liquidation/
│  └─ LiquidationEngine.sol
│
├─ oracle/
│  ├─ PriceOracle.sol
│  └─ ChainlinkOracle.sol
│
├─ tokens/
│  └─ PLP.sol
│
├─ interfaces/
│  ├─ IPerp.sol
│  ├─ IFundingRate.sol
│  ├─ IOrderBook.sol
│  ├─ ILiquidityPool.sol
│  ├─ IOracle.sol
│  └─ ILiquidationEngine.sol
│
└─ libraries/
   ├─ MathLib.sol
   ├─ PositionLib.sol
   ├─ FundingLib.sol
   └─ PriceLib.sol
3. コントラクト別責務（完全版）
Router.sol
Role：User Entry Point
責務
ユーザー操作の唯一の入口
deposit / withdraw
open / close / partial close
claimPnL
view 関数の集約
原則
重い計算は禁止
状態は持たない
positionId を生成しない
PerpetualTrading.sol
Role：取引中核（Brain）
責務
positionId 管理
ポジション状態管理
PnL 計算
Funding / OrderBook の統合点
主な状態
positions[user][positionId]
userPositionIds[user]
traderMargin[user]
claimablePnL[user]
FundingRate.sol
Role：資金調整ロジック（段階実装）
責務
Funding rate 計算
時間依存ロジック
Perpetual からのみ呼ばれる
状態
fundingIndex
pair ごとの funding 状態
※ 現在は 未接続フェーズ
OrderBook.sol
Role：on-chain 注文管理（将来拡張）
責務
注文の登録・管理
イベント発行
将来の off-chain OrderBook 連携前提
※ 現在は UI 未接続
LiquidityPool.sol
Role：資金金庫（Vault）
責務
ERC20 実体資金の保持
Trader / LP 資金管理
settlePnL
設計思想
Pool = Trader のカウンターパーティ
PLP NAV は PoolValue に連動
LiquidationEngine.sol
Role：強制決済専用レイヤ
責務
清算条件判定
強制 close 実行
原則
Perpetual 以外から liquidate 不可
Oracle Layer
Role：価格取得のみ
PriceOracle
手動価格
fallback / dev 用
ChainlinkOracle
自動価格
feed 管理
重要
Oracle はペアの存在を知らない
価格のみを返す
4. Interface の意味（契約）
Interface	意味
IPerp	Router ↔ Perpetual の仕様
IFundingRate	Funding 実装契約
IOrderBook	注文管理仕様
ILiquidityPool	資金移動境界
IOracle	価格取得抽象
ILiquidationEngine	清算専用
Interface = 仕様書
変更 = 仕様変更
5. Libraries の位置づけ（重要）
目的
数式・共通処理の一元化
Perpetual の肥大化防止
Library	役割
MathLib	精度・安全な数値計算
PositionLib	ポジション操作
FundingLib	Funding 計算
PriceLib	価格処理
6. フロントエンドとの責務境界
レイヤ	役割
UI	表示のみ
hooks/read	view / event / ws
hooks/write	tx 実行
lib/eth	ethers / ABI
contracts	真実（SSOT）
7. 未実装・未接続の明示（重要）
FundingRate（フロント未接続）
on-chain OrderBook（UI未接続）
Indexer / API
Keeper / Risk Engine
👉 未実装＝設計ミスではない
8. 引き継ぎ用 一言まとめ
Router は入口
Perpetual は頭脳
Pool は金庫
Oracle は価格のみ
Library は計算専用
Interface は仕様書
これで ② ARCHITECTURE.md（確定版） は完了です。