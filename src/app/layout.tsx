import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Times of Namibia — Namibia's Digital Broadsheet | TON",
    template: "%s — Times of Namibia",
  },
  description:
    "Times of Namibia: Namibia's premier digital broadsheet. Real-time verified news, tender analysis, job market intelligence, and market data — powered by Times OS v2.1. Informed. Instantly.",
  metadataBase: new URL("https://timesofnamibia.com"),
  keywords: [
    "Namibia",
    "News",
    "Times of Namibia",
    "TON",
    "Tenders",
    "Jobs",
    "Africa",
    "Windhoek",
    "Broadsheet Digital",
    "GemsWeb Digital",
    "Market Data",
  ],
  openGraph: {
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
    title: "Times of Namibia — Namibia's Digital Broadsheet",
    description:
      "Namibia's premier digital broadsheet. Real-time verified news, tender analysis, job market intelligence, and market data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Times of Namibia — Namibia's Digital Broadsheet",
    description:
      "Namibia's premier digital broadsheet. Real-time verified news, tender analysis, job market intelligence, and market data.",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Website JSON-LD
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Times of Namibia",
  url: "https://timesofnamibia.com",
  description: "Namibia's premier digital broadsheet. Real-time verified news, tender analysis, job market intelligence, and market data.",
  publisher: {
    "@type": "Organization",
    name: "GemsWeb Digital",
    url: "https://gemsweb.xyz",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://timesofnamibia.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* Analytics placeholder — replace GA_MEASUREMENT_ID with your actual ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-ton-red focus:text-white focus:font-mono focus:text-xs focus:px-4 focus:py-2"
        >
          Skip to main content
        </a>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
