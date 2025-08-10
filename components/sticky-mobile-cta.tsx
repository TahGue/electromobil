"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StickyMobileCta({ phone = "+46123456789" }: { phone?: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="mx-auto max-w-screen-md">
        <div className="m-3 rounded-full bg-white shadow-lg border p-2 grid grid-cols-2 gap-2">
          <Link href="/booking">
            <Button className="w-full px-5 py-3">Boka</Button>
          </Link>
          <a href={`tel:${phone}`}>
            <Button variant="secondary" className="w-full px-5 py-3">Ring</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
