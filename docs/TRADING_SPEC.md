# PerpX 取引仕様・実装まとめ（TRADING_SPEC）

> 本ドキュメントは PerpX における **取引仕様・資金フロー・PnL計算・UX前提** を固定するための資料である。
> README.md（構造・ルール）および ARCHITECTURE.md（構成・責務）と **併読することを前提**とする。

---

## 1. 全体構成（コントラクト関係）

```
User
 └─ Router（唯一のユーザー窓口）
     ├─ PerpetualTrading（ポジション管理・PnL計算）
     └─ LiquidityPool（担保管理・LP資金）

Liquidity Provider
 └─ LiquidityPool
     └─ PLP（LPトークン / NAV連動）

Price
 └─ PriceOracle
```

---

## 2. 権限設計（非常に重要）

### Router

* ユーザー操作の唯一の入口
* deposit / withdraw / open / close / claim を呼ぶ

### PerpetualTrading

* **onlyRouter**

  * onTraderDeposit
  * onTraderWithdraw
  * openPosition
  * closePosition
  * closePositionPartial
  * claimPnL
* **onlyLiquidationEngine**

  * liquidate

### LiquidityPool

* **onlyRouter**

  * deposit
* **onlyPerp**

  * withdraw
  * settlePnL

### PLP

* **onlyPool**

  * mint
  * burn

---

## 3. 資金フローの定義

### deposit（証拠金入金）

1. User → LiquidityPool に ERC20 が移動
2. PerpetualTrading.margin[user] が増加
3. ポジションはまだ開かれない

**重要：**

* deposit = 資金移動
* margin  = 取引余力

---

## 4. ポジションモデル

* positionId ベース
* 1ユーザーが複数ポジションを保持可能
* 同一ペアで複数エントリー可能

### Position 構造体

```solidity
pair        : bytes32
size        : int256    // + ロング / - ショート
entryPrice : uint256
margin     : uint256
isOpen     : bool
```

---

## 5. openPosition の役割

* 新しい positionId を発行
* Oracle から entryPrice を取得
* size != 0 必須
* margin > 0 必須

**注意：**

* deposit ≠ openPosition
* openPosition = 取引開始

---

## 6. PnL 計算ロジック

### 前提

* price は 18 decimals
* size は signed int256
* size の単位は **USD notional（設計前提）**

### PnL 計算式（USD notional 前提）

* **ロング**

```
PnL = size * (exitPrice - entryPrice) / entryPrice
```

* **ショート**

```
PnL = size * (entryPrice - exitPrice) / entryPrice
```

> ※ size を base asset 数量に変更する場合は、本式を再定義すること

---

## 7. ポジションクローズ時の精算フロー

1. Oracle から exitPrice 取得
2. PnL を計算
3. LiquidityPool.settlePnL(user, pnl)

   * pnl < 0 → traderBalances から即減算
   * pnl > 0 → claimablePnL に加算
4. ポジションを close

---

## 8. claimPnL の扱い

* 利益のみ対象（pnl > 0）
* margin とは完全分離
* claim 実行で Pool → User wallet に送金

### 定義

* margin       = 証拠金
* claimablePnL = 確定利益

---

## 9. 部分クローズ（設計方針）

### 関数

```solidity
closePositionPartial(address user, uint256 positionId, int256 closeSize)
```

### 条件

```
abs(closeSize) <= abs(position.size)
```

### 計算

```
pnlPartial    = totalPnL * closeSize / totalSize
marginPartial = position.margin * closeSize / totalSize
```

### 処理

* size を減算
* margin を減算
* size == 0 → 完全クローズ

---

## 10. Pool と LP の関係

* Trader損失 → Pool増加 → PLP NAV上昇
* Trader利益 → Pool減少 → PLP NAV低下
* LPは常にトレーダーの逆サイド

```
Pool = LP資金 + trader margin ± PnL
```

---

## 11. 表示系（フロント・UI想定）

### 取得関数

* getUserPositionIds(user)
* getPosition(user, positionId)

### 表示例

```
BTC / USD
ID: 0
Size: +1.0
Entry: 3000
Margin: 10000
PnL: +500
```

---

## 12. 現在の実装状況まとめ

* deposit / withdraw：OK
* open / close：OK
* 複数ポジション（positionId）：OK
* PnL計算：設計・数式定義済み（実装は調整中）
* claimPnL：設計済み（未実装）
* 部分クローズ：未実装
* 複数ペア：拡張可能

---

## 13. 次にやるべきこと

1. closePositionPartial 実装
2. Router に部分クローズ公開
3. 複数ペア（BTC / ETH / etc）追加
4. フロント表示整理

---

## 14. 引き継ぎ用一言まとめ

* Router は入口
* Perpetual は頭脳
* Pool は金庫
* Interface は仕様書
* positionId は Perpetual が管理
* deposit ではポジションは開かない
