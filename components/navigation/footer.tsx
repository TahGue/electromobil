import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { getBusinessInfo } from '@/lib/data/business-info';

export async function Footer() {
  const info = await getBusinessInfo();
  const socialLinks = info.socialLinks as { facebook?: string; twitter?: string; instagram?: string; } | null;

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{info.name}</h3>
            <p className="mt-4 text-sm">
              Your trusted partner for professional mobile device repairs.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-primary">Services</Link></li>
              <li><Link href="/booking" className="hover:text-primary">Book a Repair</Link></li>
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Email: {info.email}</li>
              <li>Phone: {info.phone}</li>
              <li>Address: {info.address}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Follow Us</h4>
            <div className="mt-4 flex space-x-4">
              {socialLinks?.facebook && <Link href={socialLinks.facebook} className="hover:text-primary"><Facebook size={20} /></Link>}
              {socialLinks?.twitter && <Link href={socialLinks.twitter} className="hover:text-primary"><Twitter size={20} /></Link>}
              {socialLinks?.instagram && <Link href={socialLinks.instagram} className="hover:text-primary"><Instagram size={20} /></Link>}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {info.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
