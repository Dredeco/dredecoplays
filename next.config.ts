import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    minimumCacheTTL: 60, // 1 minuto em vez de 4 horas
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "http2.mlstatic.com" },
      { protocol: "http", hostname: "api.dredecoplays.com.br" },
      { protocol: "https", hostname: "api.dredecoplays.com.br" },
    ],
  },
  expireTime: 3600,
};

export default nextConfig;
