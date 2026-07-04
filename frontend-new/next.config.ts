import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  allowedDevOrigins: [
    ".space.z.ai",
  ],
  productionBrowserSourceMaps: false,
  serverExternalPackages: ["@sparticuz/chromium", "playwright-core", "puppeteer-core", "sharp", "sudoku"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            // Times of Namibia: Google Fonts + GA + Convex + Unsplash.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: https://images.unsplash.com",
              "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://*.convex.cloud wss://*.convex.cloud",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; ") + ";",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
