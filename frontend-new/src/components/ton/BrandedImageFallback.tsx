// ============================================================
// Times of Namibia - Branded SVG Image Fallback (Phase 3)
//
// Generates a premium branded SVG with:
//   - Deep navy (#0B1D3A) background
//   - Subtle geometric minimalist pattern (HBR style)
//   - "Times of Namibia" wordmark
//   - Context-specific text (category or place name)
//
// Used when image generation or WebP conversion fails.
// ============================================================

import React from "react";

interface BrandedImageFallbackProps {
  /** Context text shown below the wordmark (e.g., "Sport", "Sossusvlei") */
  contextText?: string;
  /** Width in pixels (default 1200) */
  width?: number;
  /** Height in pixels (default 630) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

export function BrandedImageFallback({
  contextText,
  width = 1200,
  height = 630,
  className,
}: BrandedImageFallbackProps) {
  // Generate subtle geometric pattern lines (HBR minimalist style)
  const patternLines: React.ReactElement[] = [];
  const spacing = 60;
  for (let i = 0; i < width + height; i += spacing) {
    patternLines.push(
      <line
        key={`d1-${i}`}
        x1={i}
        y1={0}
        x2={i - height}
        y2={height}
        stroke="#ffffff"
        strokeWidth="0.5"
        opacity="0.04"
      />
    );
  }
  for (let i = -height; i < width; i += spacing) {
    patternLines.push(
      <line
        key={`d2-${i}`}
        x1={i}
        y1={0}
        x2={i + height}
        y2={height}
        stroke="#ffffff"
        strokeWidth="0.5"
        opacity="0.04"
      />
    );
  }

  // Add a few geometric accent shapes (HBR style circles)
  const accentShapes: React.ReactElement[] = [
    <circle key="c1" cx={width * 0.15} cy={height * 0.3} r="80" fill="none" stroke="#F2F2F2" strokeWidth="1" opacity="0.08" />,
    <circle key="c2" cx={width * 0.85} cy={height * 0.7} r="120" fill="none" stroke="#F2F2F2" strokeWidth="1" opacity="0.06" />,
    <rect key="r1" x={width * 0.4} y={height * 0.15} width="100" height="100" fill="none" stroke="#F2F2F2" strokeWidth="1" opacity="0.05" transform={`rotate(45 ${width * 0.4 + 50} ${height * 0.15 + 50})`} />,
  ];

  const svg = (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      style={{ display: "block", width: "100%", height: "auto" }}
      role="img"
      aria-label={contextText ? `Times of Namibia - ${contextText}` : "Times of Namibia"}
    >
      {/* Navy background */}
      <rect width={width} height={height} fill="#0B1D3A" />

      {/* Geometric pattern */}
      {patternLines}
      {accentShapes}

      {/* Wordmark */}
      <text
        x={width / 2}
        y={height / 2 - 20}
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="42"
        fontWeight="bold"
        fontStyle="italic"
      >
        Times of Namibia
      </text>

      {/* Context text */}
      {contextText && (
        <text
          x={width / 2}
          y={height / 2 + 30}
          textAnchor="middle"
          fill="#F2F2F2"
          fontFamily="'Helvetica Neue', Arial, sans-serif"
          fontSize="16"
          letterSpacing="4"
          opacity="0.6"
        >
          {contextText.toUpperCase()}
        </text>
      )}

      {/* Tagline */}
      <text
        x={width / 2}
        y={height - 40}
        textAnchor="middle"
        fill="#F2F2F2"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        fontSize="11"
        letterSpacing="3"
        opacity="0.3"
      >
        UNBIASED NEWS. GLOBAL REACH.
      </text>
    </svg>
  );

  return svg;
}

/**
 * Server-side function to generate the branded SVG as a string.
 * Used when we need a data URL or raw SVG for fallback images.
 */
export function generateBrandedSvgString(contextText?: string, width = 1200, height = 630): string {
  const lines: string[] = [];
  const spacing = 60;
  for (let i = 0; i < width + height; i += spacing) {
    lines.push(`<line x1="${i}" y1="0" x2="${i - height}" y2="${height}" stroke="#ffffff" stroke-width="0.5" opacity="0.04"/>`);
  }
  for (let i = -height; i < width; i += spacing) {
    lines.push(`<line x1="${i}" y1="0" x2="${i + height}" y2="${height}" stroke="#ffffff" stroke-width="0.5" opacity="0.04"/>`);
  }

  const contextSvg = contextText
    ? `<text x="${width / 2}" y="${height / 2 + 30}" text-anchor="middle" fill="#F2F2F2" font-family="'Helvetica Neue', Arial, sans-serif" font-size="16" letter-spacing="4" opacity="0.6">${contextText.toUpperCase()}</text>`
    : "";

  return `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Times of Namibia${contextText ? ' - ' + contextText : ''}">
    <rect width="${width}" height="${height}" fill="#0B1D3A"/>
    ${lines.join("\n    ")}
    <circle cx="${width * 0.15}" cy="${height * 0.3}" r="80" fill="none" stroke="#F2F2F2" stroke-width="1" opacity="0.08"/>
    <circle cx="${width * 0.85}" cy="${height * 0.7}" r="120" fill="none" stroke="#F2F2F2" stroke-width="1" opacity="0.06"/>
    <text x="${width / 2}" y="${height / 2 - 20}" text-anchor="middle" fill="#FFFFFF" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="bold" font-style="italic">Times of Namibia</text>
    ${contextSvg}
    <text x="${width / 2}" y="${height - 40}" text-anchor="middle" fill="#F2F2F2" font-family="'Helvetica Neue', Arial, sans-serif" font-size="11" letter-spacing="3" opacity="0.3">UNBIASED NEWS. GLOBAL REACH.</text>
  </svg>`;
}
