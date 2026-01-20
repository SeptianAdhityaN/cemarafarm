// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Ganti dengan hostname link gambar Anda
      },
    ],
  },
};

export default nextConfig;