import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

// Placeholder service items; can be replaced with DB data later
const defaultServices = [
  { name: "Skärmbyte", desc: "Sprucken eller okänslig skärm.", price: 799, duration: "45–60 min" },
  { name: "Batteribyte", desc: "Snabbt byte till nytt batteri.", price: 599, duration: "30–45 min" },
  { name: "Laddningsport", desc: "Åtgärdar glapp eller trasiga portar.", price: 599, duration: "45–60 min" },
  { name: "Kamerareparation", desc: "Problem med fram- eller bakkamera.", price: 899, duration: "60–90 min" },
  { name: "Vattenskada", desc: "Diagnos och rengöring av moderkort.", price: 1499, duration: "Samma dag" },
  { name: "Dataåterställning", desc: "Återställ förlorad eller raderad data.", price: 1299, duration: "Varierar" },
];

export function ServicesGrid({ services = defaultServices }: { services?: typeof defaultServices }) {
  return (
    <section id="services" className="py-16 bg-white">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Våra Tjänster</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.name} className="rounded-lg border p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{s.name}</h3>
                <span className="text-blue-600 font-semibold">från {formatPrice(s.price)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
              <div className="text-xs text-gray-500 mt-2">Tid: {s.duration}</div>
              <Link href="/booking" className="inline-block mt-4">
                <Button className="px-3 py-2 text-sm">Boka</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
