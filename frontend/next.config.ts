import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error', 'warn'] } 
      : false,
  },
  experimental: {
    optimizePackageImports: [
      'react-icons',
      'framer-motion',
      'chart.js',
      'lucide-react',
      '@radix-ui/react-dropdown-menu',
    ],
    optimisticClientCache: true,
  },
};

export default nextConfig;
