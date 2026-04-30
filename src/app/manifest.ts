import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Times of Namibia",
    short_name: "TON",
    description:
      "Namibia's premier digital broadsheet. Real-time verified news, tender analysis, job market intelligence, and market data.",
    start_url: "/",
    display: "standalone",
    background_color: "#F9F8F6",
    theme_color: "#CB102E",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["news", "business"],
    lang: "en",
    dir: "ltr",
  };
}
