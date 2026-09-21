import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www → Hauptdomain, damit Google jede Seite nur unter einer Adresse sieht
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.deraesthet.de' }],
        destination: 'https://deraesthet.de/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
