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
