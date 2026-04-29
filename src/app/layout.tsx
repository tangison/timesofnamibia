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
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
