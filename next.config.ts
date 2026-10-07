import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["zooto.taile2c6a0.ts.net"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: true },
      { source: "/products/:slug", destination: "/shop/:slug", permanent: true },
    ];
  },
};

export default nextConfig;