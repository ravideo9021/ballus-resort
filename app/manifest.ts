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
    ],
  };
}
