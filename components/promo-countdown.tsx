"use client";
import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = +target - +new Date();
  const clamp = (n: number) => (n < 0 ? 0 : n);
  return {
    days: clamp(Math.floor(diff / (1000 * 60 * 60 * 24))),
    hours: clamp(Math.floor((diff / (1000 * 60 * 60)) % 24)),
    minutes: clamp(Math.floor((diff / (1000 * 60)) % 60)),
    seconds: clamp(Math.floor((diff / 1000) % 60)),
  };
}

export function PromoCountdown({
  until = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  title = "Tidsbegränsat erbjudande: 15% rabatt på skärmbyten",
  code = "SAVE15",
}: {
  until?: Date;
  title?: string;
  code?: string;
}) {
  const [left, setLeft] = useState(getTimeLeft(until));
  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft(until)), 1000);
    return () => clearInterval(id);
  }, [until]);
  const box = (n: number, l: string) => (
    <div className="flex flex-col items-center bg-white/90 rounded-md px-3 py-2 shadow">
      <div className="text-2xl font-bold text-gray-900 tabular-nums">{n}</div>
      <div className="text-xs text-gray-600">{l}</div>
    </div>
  );
  return (
    <section className="py-10 bg-blue-50 border-y">
      <div className="container flex flex-col items-center text-center gap-4">
        <h3 className="text-xl md:text-2xl font-semibold text-blue-900">{title}</h3>
        <div className="flex gap-2">{box(left.days, "d")}{box(left.hours, "h")}{box(left.minutes, "m")}{box(left.seconds, "s")}</div>
        <div className="text-sm text-blue-900/80">Använd koden <span className="font-semibold">{code}</span> i kassan</div>
      </div>
    </section>
  );
}
