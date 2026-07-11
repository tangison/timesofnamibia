import type { Metadata } from "next";
import { Merriweather, Lato, JetBrains_Mono, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// Times of Namibia typography:
//   Wordmark:  UnifrakturMaguntia (Google Fonts — the masthead "Times of Namibia")
//   Headlines: Merriweather (Google Fonts — serif, authoritative)
//   Body:      Lato (Google Fonts — clean sans-serif)
//   Technical: JetBrains Mono (Google Fonts — monospace for labels/metadata)

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const unifrakturMaguntia = UnifrakturMaguntia({
  variable: "--font-unifraktur",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Times of Namibia | Latest Namibian News, Business and Politics",
    template: "%s — Times of Namibia",
  },
  description:
    "Times of Namibia — Namibia's digital broadsheet. Breaking news, business, mining, energy, politics, sport, tenders, and jobs from Windhoek and across all 14 regions.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com"),
  openGraph: {
    type: "website",
    locale: "en_NA",
    siteName: "Times of Namibia",
    title: "Times of Namibia | Latest Namibian News, Business and Politics",
    description:
      "Namibia's digital broadsheet. Breaking news, business, mining, energy, politics, sport, tenders, and jobs.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com",
    images: [
      {
        url: "/brand-og.png",
        width: 1200,
        height: 630,
        alt: "Times of Namibia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Times of Namibia | Latest Namibian News",
    description:
      "A TANGISON news outlet. Real-time verified news, tender analysis, job market intelligence, and market data for Namibia.",
    images: ["/brand-og.png"],
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
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com",
  description:
    "A TANGISON news outlet. Real-time verified news, tender analysis, job market intelligence, and market data for Namibia.",
  publisher: {
    "@type": "Organization",
    name: "TANGISON",
    url: "https://tangison.com",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com"}/?q={search_term_string}`,
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
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com"}/logo-mark.png`,
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
  publishingPrinciples: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com"}/editorial-standards`,
  actionableFeedbackPolicy: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com"}/contact`,
  diversityPolicy: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ton.tangison.com"}/about`,
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
        {/* Fonts loaded via next/font/google (Merriweather, Lato, UnifrakturMaguntia, JetBrains Mono) */}
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
        className={`${merriweather.variable} ${lato.variable} ${unifrakturMaguntia.variable} ${jetbrainsMono.variable} antialiased`}
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
