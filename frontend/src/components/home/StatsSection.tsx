export default function StatsSection() {
  const stats = [
    { label: "Total Volume", value: "$12.4B" },
    { label: "Open Interest", value: "$324M" },
    { label: "Active Traders", value: "142,120" },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-center">
      {stats.map((item) => (
        <div
          key={item.label}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur shadow-lg"
        >
          <div className="text-3xl font-bold">{item.value}</div>
          <div className="text-gray-400 mt-2">{item.label}</div>
        </div>
      ))}
    </section>
  );
}
