#!/bin/bash

set -e

BASE_DIR="frontend/app/home"

echo "📁 Creating Home directories..."
mkdir -p $BASE_DIR

echo "📄 Creating Hero.tsx..."
cat << 'EOF' > $BASE_DIR/Hero.tsx
"use client";

export default function Hero() {
  return (
    <section className="py-20 px-6 text-center">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Trade Perpetuals. Own Your Positions.
      </h1>

      <p className="mt-6 text-gray-300 max-w-xl mx-auto">
        PerpX is a decentralized perpetual exchange built for traders who demand control,
        transparency, and performance.
      </p>

      <div className="mt-10 flex flex-col gap-4 items-center">
        <a
          href="/trade"
          className="px-8 py-3 rounded-xl bg-yellow-400 text-black font-semibold"
        >
          取引を始める →
        </a>

        <button className="text-gray-400 text-sm">
          アプリをダウンロード
        </button>
      </div>
    </section>
  );
}
EOF

echo "📄 Creating Stats.tsx..."
cat << 'EOF' > $BASE_DIR/Stats.tsx
export default function Stats() {
  const stats = [
    { label: "累計取引高", value: "$X.XXT+" },
    { label: "アクティブウォレット", value: "X.XM+" },
    { label: "オープンインタレスト", value: "$X.XXB+" },
    { label: "TVL", value: "$X.XXB+" },
  ];

  return (
    <section className="py-16 px-6 grid grid-cols-2 gap-6 text-center">
      {stats.map((s) => (
        <div key={s.label}>
          <div className="text-2xl font-bold">{s.value}</div>
          <div className="text-sm text-gray-400 mt-1">{s.label}</div>
        </div>
      ))}
    </section>
  );
}
EOF

echo "📄 Creating Features.tsx..."
cat << 'EOF' > $BASE_DIR/Features.tsx
export default function Features() {
  const features = [
    {
      title: "マルチチェーン対応",
      desc: "チェーン切替やブリッジ不要で、シームレスに取引。",
    },
    {
      title: "深い流動性",
      desc: "統合された流動性により安定した約定を実現。",
    },
    {
      title: "高度な取引ツール",
      desc: "TP/SL、Reduce Only などプロ仕様の機能を搭載。",
    },
  ];

  return (
    <section className="py-20 px-6 space-y-12">
      <h2 className="text-2xl font-bold text-center">
        PerpX が選ばれる理由
      </h2>

      {features.map((f) => (
        <div key={f.title} className="max-w-xl mx-auto">
          <h3 className="text-lg font-semibold">{f.title}</h3>
          <p className="text-gray-400 mt-2">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
EOF

echo "📄 Creating CTA.tsx..."
cat << 'EOF' > $BASE_DIR/CTA.tsx
export default function CTA() {
  return (
    <section className="py-20 px-6 bg-yellow-400 text-black text-center">
      <h2 className="text-2xl font-bold">
        すべての取引に、確かなコントロールを。
      </h2>

      <p className="mt-4 max-w-xl mx-auto">
        PerpX は明確さと制御を重視して設計された分散型取引所です。
      </p>

      <a
        href="/trade"
        className="inline-block mt-8 px-8 py-3 rounded-xl bg-black text-white"
      >
        今すぐ取引する →
      </a>
    </section>
  );
}
EOF

echo "📄 Creating index.ts..."
cat << 'EOF' > $BASE_DIR/index.ts
export { default as Hero } from "./Hero";
export { default as Stats } from "./Stats";
export { default as Features } from "./Features";
export { default as CTA } from "./CTA";
EOF

echo "✅ Home files created successfully!"
