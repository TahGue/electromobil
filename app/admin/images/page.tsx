"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabaseClient } from "@/lib/supabase-client";

type ImageItem = {
  id: string;
  url: string;
  alt: string;
  section: ImageSection;
  creditName?: string | null;
  creditUrl?: string | null;
  position: number;
  isActive: boolean;
};

const sections = [
  { value: "HERO", label: "Hero" },
  { value: "SERVICES", label: "Tjänster" },
  { value: "TESTIMONIALS", label: "Omdömen" },
  { value: "GALLERY", label: "Galleri" },
  { value: "BOOKING", label: "Bokning" },
  { value: "CONTACT", label: "Kontakt" },
  { value: "TRUST", label: "Trust-bar" },
] as const;

type ImageSection = typeof sections[number]["value"];

export default function AdminImagesPage() {
  const { toast } = useToast();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "images";
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [section, setSection] = useState<ImageSection>("HERO");
  const [creditName, setCreditName] = useState("");
  const [creditUrl, setCreditUrl] = useState("");
  const [position, setPosition] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/images");
      if (!res.ok) throw new Error("Kunde inte hämta bilder");
      const data = await res.json();
      setItems(data);
    } catch (e: any) {
      toast({ title: "Fel", description: e.message || "Kunde inte ladda bilder", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const uploadToSupabase = async () => {
    if (!file) {
      toast({ title: "Ingen fil vald", description: "Välj en bildfil först." });
      return;
    }
    try {
      setUploading(true);
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(fileName, file, { cacheControl: "31536000", upsert: false });
      if (error) throw error;
      const { data: pub } = supabaseClient.storage.from(bucket).getPublicUrl(fileName);
      if (!pub?.publicUrl) throw new Error("Kunde inte skapa publik URL");
      setUrl(pub.publicUrl);
      toast({ title: "Uppladdad", description: "URL har fyllts i automatiskt." });
    } catch (e: any) {
      toast({ title: "Fel vid uppladdning", description: e.message || "Kunde inte ladda upp", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt, section, creditName, creditUrl, position, isActive }),
      });
      if (!res.ok) throw new Error("Kunde inte skapa bild");
      toast({ title: "Sparat", description: "Bilden har lagts till." });
      setUrl("");
      setAlt("");
      setCreditName("");
      setCreditUrl("");
      setPosition(0);
      setIsActive(true);
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e.message || "Ett fel uppstod", variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Ta bort bilden?")) return;
    try {
      const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Kunde inte ta bort bild");
      toast({ title: "Borttagen", description: "Bilden har tagits bort." });
      await load();
    } catch (e: any) {
      toast({ title: "Fel", description: e.message || "Ett fel uppstod", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Bilder</h1>
        <p className="text-muted-foreground">Hantera bilder för olika sektioner på webbplatsen.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={submit} className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Lägg till bild</h2>
          <div className="space-y-2">
            <Label htmlFor="file">Ladda upp fil (valfritt)</Label>
            <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={uploadToSupabase} disabled={uploading || !file}>
                {uploading ? "Laddar upp..." : "Ladda upp till Supabase"}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Bild-URL</Label>
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt">Alt-text</Label>
            <Input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Beskrivande alt-text" required />
          </div>
          <div className="space-y-2">
            <Label>Sektion</Label>
            <Select value={section} onValueChange={(v: ImageSection) => setSection(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Välj sektion" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="creditName">Fotograf/credit (valfritt)</Label>
              <Input id="creditName" value={creditName} onChange={(e) => setCreditName(e.target.value)} placeholder="Namn" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditUrl">Credit URL (valfritt)</Label>
              <Input id="creditUrl" value={creditUrl} onChange={(e) => setCreditUrl(e.target.value)} placeholder="https://unsplash.com/@..." />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" type="number" value={position} onChange={(e) => setPosition(Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-2 mt-6 md:mt-0">
              <input id="active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <Label htmlFor="active">Aktiv</Label>
            </div>
          </div>
          <Button type="submit">Spara</Button>
        </form>

        <div className="md:col-span-2 rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Bilder ({items.length})</h2>
            <Button variant="outline" onClick={load} disabled={loading}>{loading ? "Laddar..." : "Uppdatera"}</Button>
          </div>
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground">Inga bilder ännu.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map((img) => (
                <div key={img.id} className="border rounded-md overflow-hidden bg-white">
                  <div className="aspect-[4/3] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1 text-sm">
                    <div className="font-medium">{img.alt}</div>
                    <div className="text-xs text-muted-foreground">Sektion: {img.section} · Pos: {img.position} · {img.isActive ? "Aktiv" : "Inaktiv"}</div>
                    {img.creditName && (
                      <div className="text-xs">
                        Credit: {img.creditUrl ? (<a href={img.creditUrl} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">{img.creditName}</a>) : img.creditName}
                      </div>
                    )}
                    <div className="pt-2">
                      <Button variant="outline" onClick={() => remove(img.id)}>Ta bort</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
