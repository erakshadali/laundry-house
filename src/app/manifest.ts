import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Laundry House",
    short_name: "Laundry House",
    description: "Premium laundry and dry cleaning with doorstep pickup and delivery in Noida.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8e1",
    theme_color: "#0f2a5c",
    icons: [
      { src: "/pwa/192", sizes: "192x192", type: "image/png" },
      { src: "/pwa/512", sizes: "512x512", type: "image/png" },
      { src: "/pwa/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
