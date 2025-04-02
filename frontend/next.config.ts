import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Nếu anh chạy local trên cổng khác thì đổi số này
      },
    ],
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
