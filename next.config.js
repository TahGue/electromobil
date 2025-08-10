/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Kund: omdirigera gamla sidstrukturer till one-page sektioner
      { source: '/services', destination: '/#services', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
      // Behåll /about om du vill, annars kan denna aktiveras:
      // { source: '/about', destination: '/#reviews', permanent: false },
    ];
  },
};

module.exports = nextConfig;
