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
