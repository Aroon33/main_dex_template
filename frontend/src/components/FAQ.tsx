"use client";

const faqs = [
  {
    q: "PerpX トークンとは何ですか？",
    a: "PerpX エコシステム内で使用されるユーティリティトークンです。",
  },
  {
    q: "誰がエアドロップを請求できますか？",
    a: "対象期間中に条件を満たしたウォレットのみ請求可能です。",
  },
  {
    q: "請求期限はいつですか？",
    a: "各ステージごとに異なります。期限を過ぎると請求できません。",
  },
];

export default function FAQ() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">よくある質問</h3>

      <div className="space-y-3">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="bg-[#1a1a1a] p-4 rounded border border-gray-700"
          >
            <summary className="cursor-pointer">{f.q}</summary>
            <p className="text-gray-300 mt-2">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
