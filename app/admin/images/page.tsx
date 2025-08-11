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
  // Hero & Main Sections
  { value: "HERO", label: "Hero Slider" },
  { value: "SERVICES", label: "Tjänster" },
  { value: "TESTIMONIALS", label: "Omdömen" },
  { value: "GALLERY", label: "Galleri" },
  { value: "BOOKING", label: "Bokning" },
  { value: "CONTACT", label: "Kontakt" },
  { value: "TRUST", label: "Trust-bar" },
  
  // Core Repair Services
  { value: "SCREEN_REPAIR", label: "Skärmbyte" },
  { value: "BATTERY_REPLACEMENT", label: "Batteribyte" },
  { value: "WATER_DAMAGE", label: "Vattenskada" },
  { value: "CHARGING_PORT", label: "Laddningsport" },
  { value: "CAMERA_REPAIR", label: "Kamerareparation" },
  { value: "SPEAKER_REPAIR", label: "Högtalarreparation" },
  
  // Device Types
  { value: "IPHONE_REPAIR", label: "iPhone Reparation" },
  { value: "SAMSUNG_REPAIR", label: "Samsung Reparation" },
  { value: "TABLET_REPAIR", label: "Tablet Reparation" },
  { value: "LAPTOP_REPAIR", label: "Laptop Reparation" },
  
  // Business & Marketing
  { value: "PROMOTIONS", label: "Erbjudanden & Kampanjer" },
  { value: "BEFORE_AFTER", label: "Före & Efter" },
  { value: "CERTIFICATIONS", label: "Certifieringar & Garanti" },
  { value: "TEAM_PHOTOS", label: "Personal & Verkstad" },
  { value: "PROCESS_STEPS", label: "Reparationsprocess" },
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
  const [filterSection, setFilterSection] = useState<ImageSection | "ALL">("ALL");

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

  // Google Drive URL converter
  const [driveUrl, setDriveUrl] = useState("");
  
  const convertGoogleDriveUrl = () => {
    if (!driveUrl) {
      toast({ title: "Ingen URL", description: "Klistra in Google Drive länken först." });
      return;
    }
    
    // Extract file ID from Google Drive URL
    const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      const fileId = match[1];
      const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      setUrl(directUrl);
      setDriveUrl("");
      toast({ title: "Konverterat!", description: "Google Drive URL har konverterats och fyllts i." });
    } else {
      toast({ 
        title: "Ogiltig URL", 
        description: "Kontrollera att du kopierat rätt Google Drive delningslänk.", 
        variant: "destructive" 
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter items based on selected section
  const filteredItems = filterSection === "ALL" ? items : items.filter(item => item.section === filterSection);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting image:', { url, alt, section, creditName, creditUrl, position, isActive });
      
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt, section, creditName, creditUrl, position, isActive }),
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('API Error:', errorData);
        throw new Error("Kunde inte skapa bild");
      }
      
      const result = await res.json();
      console.log('Created image:', result);
      
      toast({ title: "Sparat", description: "Bilden har lagts till." });
      setUrl("");
      setAlt("");
      setCreditName("");
      setCreditUrl("");
      setPosition(0);
      setIsActive(true);
      
      console.log('Reloading images...');
      await load();
      console.log('Images reloaded, current count:', items.length);
    } catch (e: any) {
      console.error('Submit error:', e);
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
        <h1 className="text-3xl font-bold mb-8">Bildhantering</h1>
        
        {/* Hero Images Quick Actions */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900">Hero Slider Snabbhantering</h2>
          <p className="text-sm text-blue-700 mb-3">
            Hantera bilder som visas i huvudslideshowet på startsidan. Välj "HERO" som sektion nedan för att lägga till nya hero-bilder.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSection("HERO")}
              className="bg-blue-100 border-blue-300 hover:bg-blue-200 text-sm px-3 py-1"
            >
              Lägg till Hero-bild
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('/', '_blank')}
              className="bg-green-100 border-green-300 hover:bg-green-200 text-sm px-3 py-1"
            >
              Förhandsgranska Startsida
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">Hantera bilder för olika sektioner på webbplatsen.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <form onSubmit={submit} className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Lägg till bild</h2>
          <div className="space-y-2">
            <Label htmlFor="file">Ladda upp fil (valfritt)</Label>
            <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Bildhosting alternativ:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Google Drive:</strong> Ladda upp → Dela → "Vem som helst med länken" → Använd konverteraren nedan</li>
                <li><strong>Externa tjänster:</strong> <a href="https://imgur.com" target="_blank" className="text-blue-600 hover:underline">imgur.com</a> eller <a href="https://postimg.cc" target="_blank" className="text-blue-600 hover:underline">postimg.cc</a></li>
              </ul>
            </div>
          </div>
          
          {/* Google Drive URL Converter */}
          <div className="space-y-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Label htmlFor="driveUrl" className="text-blue-900">Google Drive URL Konverterare</Label>
            <div className="flex gap-2">
              <Input 
                id="driveUrl" 
                value={driveUrl} 
                onChange={(e) => setDriveUrl(e.target.value)} 
                placeholder="Klistra in Google Drive delningslänk här..." 
                className="flex-1"
              />
              <Button type="button" onClick={convertGoogleDriveUrl} variant="outline" className="bg-blue-100 border-blue-300">
                Konvertera
              </Button>
            </div>
            <p className="text-xs text-blue-700">
              Klistra in din Google Drive delningslänk ovan och klicka "Konvertera" för att få en direkt bildlänk.
            </p>
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
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">Bilder ({filteredItems.length})</h2>
              <Select value={filterSection} onValueChange={(v: ImageSection | "ALL") => setFilterSection(v)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrera sektion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Alla sektioner</SelectItem>
                  {sections.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={load} disabled={loading}>{loading ? "Laddar..." : "Uppdatera"}</Button>
          </div>
          {filteredItems.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {filterSection === "ALL" ? "Inga bilder ännu." : `Inga bilder i sektionen "${sections.find(s => s.value === filterSection)?.label}".`}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredItems.map((img) => (
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
