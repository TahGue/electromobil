"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Hero slide type definition
type HeroSlide = {
  id: string;
  url: string;
  alt: string;
  headline: string;
  sub: string;
  cta: { label: string; href: string };
  section: string;
  position: number;
  isActive: boolean;
  isDefault?: boolean;
  creditName?: string | null;
  creditUrl?: string | null;
};

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load hero images from API
  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        const response = await fetch('/api/images/hero');
        if (response.ok) {
          const data = await response.json();
          setSlides(data);
        }
      } catch (error) {
        console.error('Failed to load hero images:', error);
        // Fallback will be handled by API
      } finally {
        setLoading(false);
      }
    };

    loadHeroImages();
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  // Show loading state
  if (loading) {
    return (
      <section className="relative h-[80vh] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Laddar...</div>
      </section>
    );
  }

  // Show message if no slides available
  if (slides.length === 0) {
    return (
      <section className="relative h-[80vh] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Välkommen till vår mobilreparation</h1>
          <p className="text-lg">Professionell service för alla dina enheter</p>
        </div>
      </section>
    );
  }

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
            src={s.url}
            alt={s.alt}
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
          
          {/* Image credit attribution */}
          {s.creditName && (
            <div className="absolute bottom-2 right-2 text-xs text-white/70">
              {s.creditUrl ? (
                <a 
                  href={s.creditUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white/90"
                >
                  Foto: {s.creditName}
                </a>
              ) : (
                <span>Foto: {s.creditName}</span>
              )}
            </div>
          )}
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
