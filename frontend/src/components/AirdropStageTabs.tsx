"use client";

export default function AirdropStageTabs() {
  return (
    <div className="flex gap-2 mb-6">
      {["ステージ3", "ステージ2", "ステージ1"].map((stage, i) => (
        <button
          key={i}
          className="px-4 py-2 border border-gray-600 text-sm rounded"
        >
          {stage}
        </button>
      ))}
    </div>
  );
}
