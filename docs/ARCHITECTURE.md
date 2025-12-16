# PerpX アーキテクチャ & ファイル対応表（ARCHITECTURE）

> 本ドキュメントは、PerpX PoC における **ディレクトリ構成・各コントラクトの責務・仕様書との対応関係** を固定するための資料である。
> README.md（ルール・凍結事項）および TRADING_SPEC.md（取引仕様）と **併読することを前提**とする。

---

## 1. 目的（Why this document exists）

* プロジェクトを途中から引き継いでも迷わない
* 「どのファイルが何をしているか」を即座に把握できる
* 仕様書と実装の対応関係を明示する
* 実装の責務境界を壊さない

---

## 2. ディレクトリ構成（contracts）

```
contracts/
├─ core/
│  └─ Router.sol
│
├─ perpetual/
│  └─ PerpetualTrading.sol
│
├─ liquidity/
│  └─ LiquidityPool.sol
│
├─ liquidation/
│  └─ LiquidationEngine.sol
│
├─ oracle/
│  └─ PriceOracle.sol
│
├─ tokens/
│  ├─ MockERC20.sol
│  └─ PLP.sol
│
└─ interfaces/
   ├─ IPerp.sol
   ├─ ILiquidityPool.sol
   └─ IOracle.sol
```

---

## 3. 全体アーキテクチャ（依存関係）

```
User
 └─ Router
     ├─ PerpetualTrading
     ├─ LiquidityPool
     └─ PriceOracle

Liquidity Provider
 └─ LiquidityPool
     └─ PLP
```

### 原則

* User は Router 以外を直接呼ばない
* Router はオーケストレーターであり、計算ロジックを持たない
* PerpetualTrading は「頭脳」
* LiquidityPool は「金庫」

---

## 4. コントラクト別責務一覧

---

### Router.sol（User Entry Point）

---

**役割**

* ユーザーが唯一直接呼ぶコントラクト
* UI / UX レイヤ

**責務**

* deposit / withdraw
* openPosition
* closePosition / closePositionPartial
* claimPnL
* view 関数の集約

**設計思想**

* ビジネスロジックを持たない
* positionId を生成しない（Perpetual が生成）

---

---

### PerpetualTrading.sol（取引中核）

---

**役割**

* ポジション管理の中核
* PnL 計算
* positionId 管理

**主な状態**

* positions[user][positionId]
* userPositionIds[user]
* traderMargin[user]
* claimablePnL[user]

**Position 構造体**

* pair (bytes32)
* size (int256)
* entryPrice (uint256)
* margin (uint256)
* isOpen (bool)

**実装状況（PoC）**

* openPosition
* closePosition
* liquidate
* getPosition / getUserPositionIds

---

---

### LiquidityPool.sol（資金管理）

---

**役割**

* 実際の ERC20 資金を保持
* LP / Trader の資金管理

**管理対象**

* Pool 全体資金
* traderBalances[user]
* PLP supply

**機能**

* Trader deposit / withdraw
* LP deposit / withdraw
* settlePnL
* getPoolValue

**設計上の意味**

* Pool = トレーダーのカウンターパーティ

---

---

### PLP.sol（LP トークン）

---

**役割**

* LP の持分トークン
* Pool のみ mint / burn 可

**設計意図**

* PLP NAV = PoolValue / totalSupply
* LP と Trader を明確に分離

---

---

### PriceOracle.sol（価格）

---

**役割**

* pair → price 管理
* updater 制御

**前提**

* price は 18 decimals
* マルチペア対応前提

---

---

### LiquidationEngine.sol（清算）

---

**役割**

* 強制決済の専用レイヤ
* 清算条件判定

**設計意図**

* Perpetual 以外から liquidate させない

---

## 5. Interface の意味（仕様の契約）

### IPerp.sol

* Router ↔ Perpetual の契約
* 実装仕様書における PerpetualTrading 定義

### ILiquidityPool.sol

* Perpetual ↔ Pool の契約
* 資金移動の責任境界

### IOracle.sol

* 価格取得の抽象化

**重要原則**

* Interface = 仕様書
* Interface を変更する = 仕様変更

---

## 6. 仕様書ベースの対応マップ（概要）

| 仕様項目    | 実装ファイル                                    |
| ------- | ----------------------------------------- |
| 証拠金管理   | Router / LiquidityPool / PerpetualTrading |
| 複数ポジション | PerpetualTrading                          |
| 部分クローズ  | PerpetualTrading（次フェーズ）                   |
| PnL 計算  | PerpetualTrading                          |
| 清算      | LiquidationEngine                         |

---

## 7. 現在の制限・未実装

* closePositionPartial
* claimPnL
* margin 再配分
* 複数ペアの実運用
* リスク制御（IM / MM）

---

## 8. 引き継ぎ用一言まとめ

* Router は入口
* Perpetual は頭脳
* Pool は金庫
* Interface は仕様書
* positionId は Perpetual が管理
* deposit ではポジションは開かない

---

## 9. ドキュメントの優先順位

1. README.md
2. ARCHITECTURE.md（本ドキュメント）
3. TRADING_SPEC.md

この順で読めば、PerpX の全体像が崩れずに理解できる。
