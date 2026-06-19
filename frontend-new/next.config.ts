import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  allowedDevOrigins: [
    ".space.z.ai",
  ],
  productionBrowserSourceMaps: false,
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
            // TANGISON: dropped 'unsafe-eval'. Allow Fontshare + GA + Convex domains.
            // Iteration 4 Fix #9: Add *.convex.cloud to connect-src so client-side
            // useQuery/useMutation calls work once Convex is provisioned.
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://api.fontshare.com",
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
