import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// TANGISON brand typography:
//   Display:  Cabinet Grotesk (Fontshare, free)
//   Body:     Satoshi (Fontshare, free)
//   Technical: JetBrains Mono (Google Fonts)
// Fontshare fonts are loaded via <link> in <head> below because next/font
// doesn't support Fontshare directly. The CSS variables --font-display
// and --font-body are defined in globals.css.

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Times of Namibia — Applied AI. Built in Africa. | TANGISON",
    template: "%s — Times of Namibia",
  },
  description:
    "Times of Namibia — a TANGISON news outlet. Real-time verified news, tender analysis, job market intelligence, and market data for Namibia and the continent. Powered by applied AI built in Africa.",
  metadataBase: new URL("https://timesofnamibia.com"),
  keywords: [
    "Namibia",
    "News",
    "Times of Namibia",
    "TON",
    "TANGISON",
    "Tenders",
    "Jobs",
    "Africa",
    "Windhoek",
    "Applied AI",
    "Market Data",
  ],
  openGraph: {
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
    title: "Times of Namibia — Applied AI. Built in Africa.",
    description:
      "A TANGISON news outlet. Real-time verified news, tender analysis, job market intelligence, and market data for Namibia.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Times of Namibia — Applied AI. Built in Africa.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Times of Namibia — Applied AI. Built in Africa.",
    description:
      "A TANGISON news outlet. Real-time verified news, tender analysis, job market intelligence, and market data for Namibia.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: [
      { url: "/logo-mark.png", sizes: "286x286", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
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

// Website JSON-LD — TANGISON brand
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Times of Namibia",
  alternateName: "TANGISON News — Namibia",
  url: "https://timesofnamibia.com",
  description:
    "A TANGISON news outlet. Real-time verified news, tender analysis, job market intelligence, and market data for Namibia.",
  publisher: {
    "@type": "Organization",
    name: "TANGISON",
    url: "https://tangison.com",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://timesofnamibia.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// Organization JSON-LD — TANGISON as publisher
// Establishes E-E-A-T signals for Google.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: "TANGISON",
  alternateName: "TANGISON Lab",
  url: "https://tangison.com",
  logo: {
    "@type": "ImageObject",
    // TANGISON logo mark (286×286 PNG with alpha)
    url: "https://timesofnamibia.com/logo-mark.png",
    width: 286,
    height: 286,
  },
  parentOrganization: {
    "@type": "Organization",
    name: "TANGISON",
    url: "https://tangison.com",
  },
  foundingDate: "2025",
  areaServed: {
    "@type": "Country",
    name: "Namibia",
  },
  // Placeholder social profiles — replace with real handles once created.
  sameAs: [
    "https://x.com/tangison",
    "https://www.linkedin.com/company/tangison",
    "https://github.com/tangison",
    "https://www.instagram.com/tangison",
    "https://www.youtube.com/@tangison",
  ],
  publishingPrinciples: "https://timesofnamibia.com/editorial-standards",
  actionableFeedbackPolicy: "https://timesofnamibia.com/contact",
  diversityPolicy: "https://timesofnamibia.com/about",
};

// Helper: safely serialize JSON-LD — escape < to prevent script injection.
function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NA" suppressHydrationWarning>
      <head>
        {/* TANGISON brand typography — Cabinet Grotesk + Satoshi via Fontshare */}
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,700,800,900&f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
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
                `.replace(/</g, "\\u003c"),
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${jetbrainsMono.variable} antialiased`}
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
