import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroSlider } from '@/components/hero-slider'
import { TrustBar } from '@/components/trust-bar'
import { ServicesGrid } from '@/components/services-grid'
import { BeforeAfterGallery } from '@/components/before-after-gallery'
import { Testimonials } from '@/components/testimonials'
import GoogleReviews from '@/components/google-reviews'
import { PromoCountdown } from '@/components/promo-countdown'
import { StickyMobileCta } from '@/components/sticky-mobile-cta'
import WhatsAppChat from '@/components/whatsapp-chat'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Slider + Trust */}
      <HeroSlider />
      <TrustBar />
      <PromoCountdown />

      {/* Services */}
      <ServicesGrid />

      {/* Before / After */}
      <BeforeAfterGallery />

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Testimonials */}
      <Testimonials />

      {/* Call to Action */}
      <section id="contact" className="bg-blue-50 py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
  Behöver hjälp med din enhet?
            <p className="text-gray-600 mb-8">
  Låt inte en trasig enhet förstöra din dag.
            </p>
            <Link href="/contact">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
  Kontakta oss
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky CTA on mobile */}
      <StickyMobileCta />

      {/* WhatsApp Chat Widget */}
      <WhatsAppChat 
        phoneNumber="0701234567"
        businessName="Electromobil"
        position="bottom-right"
      />
    </main>
  )
}
