PerpX – TRADING_SPEC
Trading Rules / Fund Flow / PnL Definition (Expanded PoC)
0. 本ドキュメントの位置づけ
本ドキュメントは PerpX における取引仕様の唯一の正本である。
README.md：思想・全体像
ARCHITECTURE.md：責務・構造
TRADING_SPEC.md：取引ルール・数式・資金フロー
👉 数値・計算・挙動に関する最終判断は本書を正とする
1. 基本前提（絶対ルール）
すべての取引は Router 経由
複数ポジション（positionId）を許可
同一ペアで複数ポジション可
UI は 表示専用
計算の真実は on-chain
2. 用語定義
Margin（証拠金）
Trader が Pool に預けた資金
取引余力を表す
PnL とは 完全に分離
Position
1回の取引単位
positionId により一意に管理
ClaimablePnL
確定利益
margin とは別枠で管理
3. コントラクト関係（資金フロー視点）
User Wallet
   │
   ▼
LiquidityPool  ← 実体資金
   │
   ▼
PerpetualTrading
Pool が 唯一の資金保管庫
Perpetual は 帳簿
Router は 窓口
4. deposit（証拠金入金）
フロー
User → LiquidityPool に ERC20 移動
Perpetual.traderMargin[user] += amount
ポジションは開かれない
重要
deposit = 資金移動
deposit ≠ openPosition
margin = 取引余力
5. Position モデル
Position 構造体
struct Position {
    bytes32 pair;
    int256 size;        // USD notional（+long / -short）
    uint256 entryPrice; // 18 decimals
    uint256 margin;     // このポジション専用
    bool isOpen;
}
size の意味
単位：USD notional
long：正
short：負
👉 将来 base asset 数量に変更する場合は
本仕様を破壊的変更として更新する
6. openPosition
条件
size != 0
traderMargin >= required margin
pair が UI 上 enabled
処理
Oracle から entryPrice 取得
positionId 発行
Position 作成
margin を traderMargin から切り出し
7. PnL 計算（確定定義）
前提
price：18 decimals
size：USD notional
計算は Perpetual 側で確定
数式
Long
PnL = size * (exitPrice - entryPrice) / entryPrice
Short
PnL = size * (entryPrice - exitPrice) / entryPrice
8. closePosition（フルクローズ）
フロー
exitPrice を Oracle から取得
PnL 計算
LiquidityPool.settlePnL(user, pnl)
Position.isOpen = false
精算ルール
pnl < 0
→ margin から即時減算
pnl > 0
→ claimablePnL に加算
9. closePositionPartial（部分クローズ）
関数
closePositionPartial(
  address user,
  uint256 positionId,
  int256 closeSize
)
条件
abs(closeSize) <= abs(position.size)
計算
pnlPartial    = totalPnL * closeSize / totalSize
marginPartial = position.margin * closeSize / totalSize
処理
size -= closeSize
margin -= marginPartial
size == 0 → 完全クローズ扱い
10. claimPnL
定義
利益のみ対象（pnl > 0）
margin とは独立
フロー
claimablePnL[user] > 0 を確認
Pool → User wallet に送金
claimablePnL = 0
11. Liquidation（清算）
実行主体
LiquidationEngine のみ
原則
traderMargin が維持率を下回った場合
強制 close を実行
※ 詳細条件は 次フェーズで確定
12. FundingRate（将来接続）
目的
Long / Short の不均衡調整
時間経過型コスト
現在の状態
コントラクト実装あり
フロント・取引フロー未接続
👉 未実装 ≠ 仕様未定
13. フロント UI 前提
Position / PnL / Leverage は 表示用
最終値は on-chain を正とする
フロント計算は UX 補助のみ
14. 現在の実装フェーズまとめ
機能	状態
deposit / withdraw	✅
openPosition	✅
closePosition	✅
partial close	🔜
claimPnL	🔜
Funding	🔜
Liquidation	🔜
15. 一言まとめ（取引仕様）
deposit は資金移動
open は取引開始
close は精算
PnL は margin と分離される
これで ③ TRADING_SPEC.md（確定版） まで完了です。