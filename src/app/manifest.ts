import type { MetadataRoute } from "next";
import { BUSINESS } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS.name,
    short_name: BUSINESS.name,
    description: BUSINESS.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a", // --color-background
    theme_color: "#0a0a0a", // --color-background
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
