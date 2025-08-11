export function Testimonials() {
  const items = [
    {
      name: "Sara, Solna",
      text: "Skärmen byttes på under en timme. Fantastisk service och trevlig personal!",
    },
    {
      name: "Jonas, Sundbyberg",
      text: "Batteriet känns som nytt. Bokningen var enkel och priset bra.",
    },
    {
      name: "Aisha, Bromma",
      text: "De kom hem till mig och fixade laddningsporten. Super smidigt!",
    },
  ];
  return (
    <section id="reviews" className="py-16 bg-white">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Kundrecensioner</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t) => (
            <blockquote key={t.name} className="rounded-lg border p-5 bg-gray-50">
              <p className="text-gray-800">“{t.text}”</p>
              <footer className="mt-3 text-sm text-gray-700">— {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
