export function TrustBar() {
  const items = [
    { label: "4,9★ på Google", sub: "250+ omdömen" },
    { label: "Reparation samma dag", sub: "De flesta klart under 1 timme" },
    { label: "Garanti", sub: "6–12 månader på delar" },
    { label: "OEM‑klassade delar", sub: "Premiumkvalitet" },
  ];
  return (
    <section className="bg-white py-6 border-b">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((i) => (
          <div key={i.label} className="text-center">
            <div className="font-semibold text-gray-900">{i.label}</div>
            <div className="text-sm text-gray-700">{i.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
