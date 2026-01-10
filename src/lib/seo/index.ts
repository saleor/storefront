/**
 * SEO Module
 *
 * Centralized SEO utilities for the Saleor storefront.
 *
 * ## Quick Start
 *
 * 1. Root layout metadata:
 * ```tsx
 * // src/app/layout.tsx
 * export { rootMetadata as metadata } from "@/lib/seo";
 * ```
 *
 * 2. Page metadata:
 * ```tsx
 * import { buildPageMetadata } from "@/lib/seo";
 *
 * export async function generateMetadata() {
 *   return buildPageMetadata({
 *     title: "Page Title",
 *     description: "Page description",
 *     image: "/image.jpg",
 *   });
 * }
 * ```
 *
 * 3. Product JSON-LD:
 * ```tsx
 * import { buildProductJsonLd } from "@/lib/seo";
 *
 * const jsonLd = buildProductJsonLd({
 *   name: product.name,
 *   price: { amount: 29.99, currency: "USD" },
 * });
 *
 * <script type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
 * />
 * ```
 *
 * ## Configuration
 *
 * Edit `src/lib/seo/config.ts` to customize:
 * - Site name and description
 * - Twitter handle
 * - Enable/disable features (JSON-LD, OpenGraph, Twitter cards)
 *
 * ## Disabling SEO
 *
 * To completely remove SEO features:
 * 1. Delete this module (`src/lib/seo/`)
 * 2. Remove imports from layout.tsx and page files
 * 3. Delete `src/app/api/og/route.tsx` (dynamic OG images)
 * 4. Optionally simplify `src/app/robots.ts`
 */

// Configuration
export { seoConfig, getBaseUrl, getMetadataBase } from "./config";

// Metadata helpers
export { rootMetadata, buildPageMetadata, truncateText } from "./metadata";

// JSON-LD structured data
export { buildProductJsonLd, jsonLdScriptProps } from "./json-ld";
