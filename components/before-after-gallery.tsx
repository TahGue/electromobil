"use client";
import { useState } from "react";

const images = [
  {
    before: "https://images.unsplash.com/photo-1520367745676-56196632073f?q=80&w=1200&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1557320198-b5e5e56efecd?q=80&w=1200&auto=format&fit=crop",
    caption: "iPhone 13 Skärm • 45 min",
  },
  {
    before: "https://images.unsplash.com/photo-1619979881757-2b2aeae368a2?q=80&w=1200&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1616348436168-64e8a1eae6e4?q=80&w=1200&auto=format&fit=crop",
    caption: "Samsung Batteri • 40 min",
  },
  {
    before: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    after: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?q=80&w=1200&auto=format&fit=crop",
    caption: "Laddningsport • 60 min",
  },
];

export function BeforeAfterGallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="work" className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Före & Efter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <button
              key={idx}
              className="group text-left rounded-lg overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
              onClick={() => setOpen(idx)}
            >
              <div className="grid grid-cols-2">
                <img src={img.before} alt="Före" className="aspect-[4/3] w-full object-cover" />
                <img src={img.after} alt="Efter" className="aspect-[4/3] w-full object-cover" />
              </div>
              <div className="p-3 text-sm text-gray-700">{img.caption}</div>
            </button>
          ))}
        </div>

        {open !== null && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setOpen(null)}>
            <div className="max-w-3xl w-full bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <img src={images[open].before} alt="Före" className="w-full h-full object-cover" />
                <img src={images[open].after} alt="Efter" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 text-center font-medium">{images[open].caption}</div>
              <button className="absolute top-4 right-4 text-white" onClick={() => setOpen(null)}>✕</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
