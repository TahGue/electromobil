"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Simple auto-rotating slider using external stock images.
// Swap these URLs later with images placed in /public if desired.
const slides = [
  {
    src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    headline: "Skärmbyte samma dag",
    sub: "Premiumdelar, experttekniker, 6–12 mån garanti",
    cta: { label: "Boka nu", href: "/booking" },
  },
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
    headline: "Batteribyte på 45 minuter",
    sub: "Håll din mobil som ny",
    cta: { label: "Få offert", href: "/booking" },
  },
  {
    src: "https://images.unsplash.com/photo-1555421689-43cad7100751?q=80&w=1600&auto=format&fit=crop",
    headline: "Vi kommer till dig",
    sub: "Reparation på plats i ditt område",
    cta: { label: "Ring oss", href: "tel:+46123456789" },
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          {/* Background image */}
          {/* Using native img to avoid Next Image domain config for external sources */}
          <img
            src={s.src}
            alt={s.headline}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{s.headline}</h1>
                <p className="text-lg md:text-xl text-white/90 mb-8">{s.sub}</p>
                <Link href={s.cta.href}>
                  <Button className="bg-white text-black hover:bg-gray-100 px-6 py-3">
                    {s.cta.label}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Gå till bild ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
