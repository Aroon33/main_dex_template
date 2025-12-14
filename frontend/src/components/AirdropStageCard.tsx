"use client";

export default function AirdropStageCard() {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-2">
        ステージ2での PerpX エアドロップ
      </h2>

      <p className="text-gray-300 mb-4">
        320,000,000 $PERPX トークンを
        ステージ2に参加したコミュニティメンバーに配布します。
      </p>

      <p className="text-sm text-gray-400 mb-4">
        請求期間：2025年10月14日 12:00 UTC 〜 2025年11月14日 12:00 UTC
      </p>

      <button className="bg-[#d6b07a] text-black px-6 py-3 rounded font-semibold">
        Connect →
      </button>
    </div>
  );
}
