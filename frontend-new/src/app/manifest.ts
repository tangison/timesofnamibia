import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Times of Namibia — A TANGISON Publication",
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
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon-48.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    categories: ["news", "business", "education"],
    lang: "en-NA",
    dir: "ltr",
  };
}
