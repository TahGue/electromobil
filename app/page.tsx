import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
  Professionell Mobilreparation
            </h1>
            <p className="text-xl text-white/90 mb-8">
  Låt din enhet repareras av certifierade tekniker med samma dag
            </p>
            <Link href="/booking">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
  Boka Reparation Nu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white">
        <div className="container">
  Våra Tjänster
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Cards will be dynamically populated from database */}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-50 py-20">
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
    </main>
  )
}
