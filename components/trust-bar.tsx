export function TrustBar() {
  const items = [
    { label: "4.9★ on Google", sub: "250+ reviews" },
    { label: "Same‑Day Repair", sub: "Most fixes under 1 hour" },
    { label: "Warranty", sub: "6–12 months on parts" },
    { label: "OEM‑grade Parts", sub: "Premium quality" },
  ];
  return (
    <section className="bg-white py-6 border-b">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((i) => (
          <div key={i.label} className="text-center">
            <div className="font-semibold text-gray-900">{i.label}</div>
            <div className="text-sm text-gray-500">{i.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
