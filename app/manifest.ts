import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Omega — UCU Quantum Computing Chapter",
    short_name: "Omega",
    description:
      "Coordination and learning for the Quantum Computing Chapter at Uganda Christian University.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F8",
    theme_color: "#003087",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
