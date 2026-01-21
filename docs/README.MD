📘 Trade Module 引き継ぎ資料（現状理解用）
1. この Trade モジュールは何をしているか

このモジュールは Perpetual Trading UI のフロントエンド実装で、
以下を提供しています。

ポジション一覧（on-chain）

取引履歴（on-chain + event）

注文履歴（event-driven）

オーダーブック（WebSocket）

UI は すべて PURE（表示専用）

👉 UI とブロックチェーンロジックを完全に分離しています。

2. 全体アーキテクチャ（重要）
WalletContext (address only)
        ↓
TradeTab / TradePage (UI)
        ↓
hooks/trade/* (PURE logic)
        ↓
on-chain view / events / WebSocket

絶対ルール

UI は provider / signer / contract を触らない

hooks は account?: string のみを受け取る

provider は hook 内で自己解決

write 処理は 専用 hook に集約予定

3. 主要ファイルと役割
📄 src/pages/Tradetab.tsx

役割：UI 専用（表示・タブ切替）

WalletContext から address のみ取得

hooks に account?: string を渡す

ロジックなし

TypeScript エラーが出ないのが正常

UI を変更したい場合はここだけ触る

📄 src/hooks/trade/useTradeHistorySimple.ts

役割：取引履歴（on-chain + event）

使用関数：

getTradeCount

getTrade

使用イベント：

TradeExecuted

挙動：

初回は view 関数で全取得

イベント発火時に自動再取得

UI は一切触らない

📄 src/hooks/trade/usePositions.ts

役割：ポジション一覧（on-chain + event）

使用関数：

getUserPositionIds

getPosition

getMargin

getClaimablePnL

使用イベント：

PositionOpened

PositionUpdated

PositionClosed

返り値：

positions

margin

claimablePnL

📄 src/hooks/trade/useOrderHistory.ts

役割：注文履歴（event-driven）

使用イベント：

OrderPlaced

OrderFilled

OrderCancelled

view 関数は未使用（イベントのみ）

📄 src/hooks/trade/useOrderBook.ts

役割：オーダーブック（WebSocket）

Binance WebSocket を使用

UI に asks / bids を返すだけ

on-chain 非依存

4. なぜこの設計なのか（重要）
解決したかった問題

provider / signer の受け渡しが複雑

Context が肥大化

TypeScript エラーが頻発

UI とロジックが密結合

今の設計のメリット

hook 単位でテストしやすい

UI を壊さずに on-chain 実装を差し替え可能

event を足しても UI は無傷

TS が設計違反を即検知

5. いま「未実装」のもの（意図的）

以下は 未実装だが問題ではありません。

write 系処理

close position

partial close

claim PnL

order view API（イベントのみ）

👉 次のフェーズで追加予定

6. 次に触るべき場所（TODO）
🔧 実装フェーズ

write hook 実装

useClosePosition

useClaimPnL

event を write 成功後に発火確認

loading / error state の UI 表示

🧪 安定化

debounce（event 連続時）

chain 切替対応

StrictMode 対応

7. 触ってはいけないルール（超重要）

❌ UI で BrowserProvider を使う

❌ hook に provider を引数で渡す

❌ Context を hook から直接読む

❌ 部分的な差分修正（必ず EOF 全体置換）

8. この状態での判断基準
状態	正常？
データが一時的に出ない	✅ 正常
TS エラーが出ない	✅ 正常
UI が短い	✅ 正常
hook が長い	✅ 正常
9. まとめ（1行）

UI は表示だけ、hook がすべてを知る。
provider は hook の中に閉じ込める。