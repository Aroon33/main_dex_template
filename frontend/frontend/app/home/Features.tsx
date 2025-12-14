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
