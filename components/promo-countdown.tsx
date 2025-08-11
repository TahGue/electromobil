"use client";
import { useEffect, useState } from "react";

interface PromoConfig {
  id: string;
  isActive: boolean;
  title: string;
  description: string;
  percentage: number;
  couponCode: string;
  endDateTime: string;
}

function getTimeLeft(target: Date) {
  const diff = +target - +new Date();
  const clamp = (n: number) => (n < 0 ? 0 : n);
  return {
    days: clamp(Math.floor(diff / (1000 * 60 * 60 * 24))),
    hours: clamp(Math.floor((diff / (1000 * 60 * 60)) % 24)),
    minutes: clamp(Math.floor((diff / (1000 * 60)) % 60)),
    seconds: clamp(Math.floor((diff / 1000) % 60)),
    expired: diff <= 0,
  };
}

export function PromoCountdown() {
  const [promoConfig, setPromoConfig] = useState<PromoConfig | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
  const [loading, setLoading] = useState(true);

  // Fetch promo configuration from API
  useEffect(() => {
    const fetchPromoConfig = async () => {
      try {
        const response = await fetch('/api/promo-countdown');
        if (response.ok) {
          const data = await response.json();
          setPromoConfig(data);
        }
      } catch (error) {
        console.error('Error fetching promo config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoConfig();
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!promoConfig?.endDateTime) return;

    const updateTimer = () => {
      const endDate = new Date(promoConfig.endDateTime);
      setTimeLeft(getTimeLeft(endDate));
    };

    updateTimer(); // Initial update
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [promoConfig?.endDateTime]);

  // Don't show if loading, inactive, expired, or no config
  if (loading || !promoConfig || !promoConfig.isActive || timeLeft.expired) {
    return null;
  }

  const box = (n: number, l: string) => (
    <div className="flex flex-col items-center bg-white/90 rounded-md px-3 py-2 shadow">
      <div className="text-2xl font-bold text-gray-900 tabular-nums">{n}</div>
      <div className="text-xs text-gray-600">{l}</div>
    </div>
  );

  const fullTitle = `${promoConfig.title}: ${promoConfig.percentage}% ${promoConfig.description}`;

  return (
    <section className="py-10 bg-blue-50 border-y">
      <div className="container flex flex-col items-center text-center gap-4">
        <h3 className="text-xl md:text-2xl font-semibold text-blue-900">{fullTitle}</h3>
        <div className="flex gap-2">
          {box(timeLeft.days, "d")}
          {box(timeLeft.hours, "h")}
          {box(timeLeft.minutes, "m")}
          {box(timeLeft.seconds, "s")}
        </div>
        <div className="text-sm text-blue-900/80">
          Använd koden <span className="font-semibold">{promoConfig.couponCode}</span> i kassan
        </div>
      </div>
    </section>
  );
}
