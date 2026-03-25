import type { NextConfig } from 'next';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
