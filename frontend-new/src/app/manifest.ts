import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Times of Namibia - A TANGISON Publication",
    short_name: "Times of Namibia",
    description:
      "A TANGISON news outlet. Real-time verified news, tender analysis, job market intelligence, and market data for Namibia. Applied AI. Built in Africa.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF8",  // TANGISON warm-white
    theme_color: "#C56A4A",       // TANGISON rust-signal
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo-mark.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo-mark.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo-mark.png",
        sizes: "286x286",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["news", "business", "education"],
    lang: "en-NA",
    dir: "ltr",
  };
}
