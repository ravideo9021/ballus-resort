import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ballu's Resort & Café",
    short_name: "Ballu's",
    description: "A premium Himalayan resort & café on the banks of the Beas River.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1B22",
    theme_color: "#0B1B22",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
