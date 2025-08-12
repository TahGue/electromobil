import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { getBusinessInfo } from '@/lib/data/business-info';

// TikTok icon component (since it's not in lucide-react)
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
  </svg>
);

export async function Footer() {
  const info = await getBusinessInfo();
  const socialLinks = info.socialLinks as { facebook?: string; twitter?: string; instagram?: string; tiktok?: string; } | null;

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{info.name}</h3>
            <p className="mt-4 text-sm">
              Din pålitliga partner för professionella reparationer av mobila enheter.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Snabblänkar</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/#services" className="hover:text-primary">Tjänster</Link></li>
              <li><Link href="/booking" className="hover:text-primary">Boka en reparation</Link></li>
              <li><Link href="/#reviews" className="hover:text-primary">Omdömen</Link></li>
              <li><Link href="/#contact" className="hover:text-primary">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Kontakta oss</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>E-post: {info.email}</li>
              <li>Telefon: {info.phone}</li>
              <li>Adress: {info.address}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Följ oss</h4>
            <div className="mt-4 flex space-x-4">
              <Link href={socialLinks?.facebook || "#"} className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </Link>
              <Link href={socialLinks?.instagram || "#"} className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </Link>
              <Link href={socialLinks?.tiktok || "#"} className="hover:text-primary transition-colors" aria-label="TikTok">
                <TikTokIcon size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {info.name}. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
}
