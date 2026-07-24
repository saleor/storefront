---
name: seo-metadata
description: SEO: metadata helpers, product JSON-LD, OG images, hreflang/canonical for locale×channel. Use when adding page metadata, structured data, or social images.
---

# SEO & Metadata

Add page metadata, JSON-LD structured data, and OG images.

> **Sources**:
>
> - [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) - Metadata API
> - [Schema.org Product](https://schema.org/Product) - JSON-LD structured data format

## Configuration

All SEO settings are in `src/lib/seo/config.ts`:

```typescript
export const seoConfig = {
	siteName: "Saleor Store",
	description: "...",
	twitterHandle: null, // Set to enable Twitter cards
	enableJsonLd: true,
	enableOpenGraph: true,
	enableTwitterCards: true,
	noIndexPaths: ["/checkout"], // Excluded from crawlers
};
```

## File Structure

```
src/lib/seo/
├── index.ts           # Public exports
├── config.ts          # Configuration (no static og:locale)
├── metadata.ts        # Page metadata helpers + resolveSeoDescription
├── metadata.test.ts
├── hreflang.ts        # Locale/channel hreflang + x-default
├── hreflang.test.ts
├── json-ld.ts         # Structured data helpers
└── og-brand-colors.ts
```

## Root / locale layout metadata

`rootMetadata` holds site-wide defaults (title template, icons, robots, OG siteName/images) **without** a hardcoded `og:locale`.

The storefront locale layout (`(storefront)/[locale]/layout.tsx`) exports params-only `generateMetadata` that sets `openGraph.locale` from the URL locale’s `ogLocale` (`ja` → `ja_JP`). Browse pages that call `buildBrowsePageMetadata` replace the OpenGraph block wholesale (and set locale + alternates themselves). Non-browse pages (login, account, cart) inherit the layout locale.

```typescript
// src/app/(storefront)/[locale]/layout.tsx — params-only, PPR-safe
export async function generateMetadata({ params }): Promise<Metadata> {
	const { locale } = await params;
	const definition = resolveLocaleFromSlug(/* … */);
	return { ...rootMetadata, openGraph: { ...rootMetadata.openGraph, locale: definition.ogLocale } };
}
```

## Page Metadata

```typescript
import { buildBrowsePageMetadata, resolveSeoDescription } from "@/lib/seo";

export async function generateMetadata({ params }) {
	const product = await getProductData(/* … */);
	return buildBrowsePageMetadata({
		title: product.seoTitle || product.name,
		description: resolveSeoDescription({
			seoDescription: product.seoDescription,
			body: product.description,
			fallbackName: product.name,
		}),
		locale: params.locale,
		channel: params.channel,
		pathSuffix: catalogPathSuffix("products", product),
		pathSuffixByLocale: buildCatalogPathSuffixByLocale("products", buildLocaleSlugMap(product)),
		ogType: "product", // omits openGraph.type — see PDP og:type below
	});
}
```

## Product JSON-LD

```typescript
import { buildProductJsonLd } from "@/lib/seo";

const jsonLd = buildProductJsonLd({
  name: product.name,
  description: product.description,
  price: { amount: 29.99, currency: "USD" },
  inStock: true,
  images: [product.thumbnail?.url],
});

// In JSX (jsonLdScriptProps escapes `</script>` / U+2028 / U+2029 for inline scripts):
{jsonLd && <script {...jsonLdScriptProps(jsonLd)} />}
```

> **Never** inline `dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}` — plain
> `JSON.stringify` does not escape `<`, so a CMS-controlled value containing `</script>`
> breaks out of the script tag (CodeQL "improper code sanitization"). Use `jsonLdScriptProps`,
> or `serializeForInlineScript` from `@/lib/html/inline-script` for other inline scripts.

## Dynamic OG Images

The `/api/og` route generates branded images:

```
/api/og?title=Product%20Name&price=€29.99
```

Use in metadata:

```typescript
buildPageMetadata({
	title: product.name,
	image: `/api/og?title=${encodeURIComponent(product.name)}`,
});
```

## Examples

### Complete Product Page SEO

Use `buildBrowsePageMetadata` + `resolveSeoDescription` + JSON-LD (see International URLs and Product JSON-LD above). The live PDP is `src/app/(storefront)/[locale]/[channel]/(main)/products/[slug]/page.tsx` — `ProductShell` hoists `og:type=product` after the product resolves; `generateMetadata` sets `ogType: "product"` so Next never receives an invalid `openGraph.type`.

## International URLs

Browse canonical URLs include locale and channel: `/{locale}/{channel}/…` (see `docs/adr/0001-locale-channel-url-routing.md`, `ui-locale-routing.md`).

- Use `buildBrowsePageMetadata()` for catalog/CMS pages — sets canonical + `hreflang` alternates, plus `og:locale` (from the URL locale's `ogLocale`) and `og:locale:alternate` for other **reachable** locales (matrix locales when `LOCALE_CHANNELS` is set; otherwise all `STOREFRONT_LOCALES`).
- Non-browse pages inherit `og:locale` from the storefront locale layout's `generateMetadata` — never hardcode a locale in OG tags.
- Meta/OG/JSON-LD descriptions: use `resolveSeoDescription()` — `seoDescription` → translated Editor.js plain text → name. Don't let them collapse to the bare entity name.
- **PDP `og:type=product`:** Next's metadata API **rejects** OG types outside its union at runtime (**E237** — throws and drops the page's whole metadata). `ogType: "product"` therefore omits `openGraph.type`, and `ProductShell` hoists `<meta property="og:type" content="product">` **only after the product resolves** (never on the missing-slug `notFound()` path — a sync-shell tag would advertise `product` on 404s). Trade-off: the tag sits behind the page `Suspense` boundary; bot UAs that wait on `generateMetadata` still get the rest of OG, and cached shells resolve quickly. Do **not** use `metadata.other: { "og:type": "product" }` — Next renders that as `name=`, not `property=`.
- `generateMetadata` `pathSuffix` is the path after locale/channel for **this** locale, e.g. `/products/${pickTranslatedSlug(product)}`.
- For translated catalog slugs (ADR 0004), also pass `pathSuffixByLocale` from `buildCatalogPathSuffixByLocale` / `buildLocaleSlugMap` so each `hreflang` points at that language’s handle.
- `<html lang>` is rendered server-side by the storefront root layout (`(storefront)/[locale]/layout.tsx`), derived from the URL locale segment (`htmlLang`, language-only) — no client patching.

```typescript
import { buildBrowsePageMetadata, resolveSeoDescription } from "@/lib/seo";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "@/lib/catalog/locale-slugs";
import { catalogPathSuffix } from "@/lib/catalog/canonical-slug";

return buildBrowsePageMetadata({
	title: category.name,
	description: resolveSeoDescription({
		seoDescription: category.seoDescription,
		body: category.description,
		fallbackName: category.name,
	}),
	locale: params.locale,
	channel: params.channel,
	pathSuffix: catalogPathSuffix("categories", category),
	pathSuffixByLocale: buildCatalogPathSuffixByLocale("categories", buildLocaleSlugMap(category)),
});
```

### hreflang keys and `x-default`

`buildLocaleHreflangAlternates()` (used by `buildBrowsePageMetadata`):

| Config                                      | hreflang keys                                | URLs                                             |
| ------------------------------------------- | -------------------------------------------- | ------------------------------------------------ |
| No `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS` | Language-only (`ja`, `en`) from `htmlLang`   | Each locale keeps the **current** page’s channel |
| Pairs set (`ja:japan,en:default,…`)         | Region-aware (`ja-JP`, `en-US`) from `bcp47` | Each locale uses its **paired** channel          |

**`x-default`** points at `NEXT_PUBLIC_DEFAULT_LOCALE` + that locale’s paired/default channel — same knob as the root redirect and invalid-locale fallback. Paper intentionally does **not** add a separate `x-default` env; change the demo/default locale if the fallback URL is wrong.

### Locale×channel pairs (SEO + navigation)

Optional `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS=en:uk,pl:pl` (see `src/config/locale-channel.ts`):

1. Invalid pairs → `notFound()`
2. Language switch navigates to the paired channel (Japanese → `japan`, etc.)
3. Region picker filters languages per market
4. hreflang becomes region-aware (table above)

When unset, any allowlisted locale × channel is valid and language switch **keeps** the current channel.

## Known Next.js / audit findings

- **Streaming metadata “duplicates”:** For normal browser UAs, Next may stream metadata into `<body>` then also place copies in `<head>` after hydration — DevTools can show 2× canonical / 18× hreflang. Bot UAs get blocking `<head>` metadata (`htmlLimitedBots`). Not a Paper double-`generateMetadata` bug; soft locale/market navigations can make leftovers more visible. Prefer curl/bot UA or settled head counts when auditing.
- **E237 `Invalid OpenGraph type: product`:** Closed OG type union in Next’s Metadata API; unknown types throw and abort the metadata RSC payload. Workaround: omit `openGraph.type` + hoist `<meta property="og:type" content="product">` in `ProductShell` only after the product resolves (never on 404).

## Sitemap & robots (do not ship naive)

Paper has **no** `sitemap.ts` / `robots.ts` yet (middleware already reserves `sitemap.xml` / `robots.txt`). On-page canonical + hreflang cover most crawl signals; a wrong sitemap is worse than none.

**Why a single `sitemap.ts` dump fails at scale**

- URL cardinality ≈ products × locales × channels (plus categories / collections / pages). 10k SKUs × 8 locales × 5 channels ≈ 400k product URLs alone.
- Protocol / Google limits: **≤50k URLs and ≤50MB per sitemap file**.
- Live Saleor GraphQL walks of the full catalog risk timeouts, serverless memory, and slow TTFB.
- Translated slugs (ADR 0004) mean each locale may need its own handle — you cannot stamp one primary-slug list across languages.

**Required shape when implementing**

1. **Sitemap index + chunks** via Next [`generateSitemaps`](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) (`/sitemap.xml` → `/sitemap/0.xml`, …), ~≤40–50k URLs each.
2. **Paginate Saleor with cursors** (`first` / `after`) per chunk — never load the full catalog into memory.
3. **Chunk by stable dimensions** (e.g. `{channel}:{locale}:{entity}:{page}` or at least `{channel}:{page}`), not one global product offset.
4. **Respect `LOCALE_CHANNELS`:** when set, emit only paired locale×channel URLs (same set as hreflang). When unset, avoid a blind full cross-product — prefer channel-scoped chunks; on-page hreflang already advertises language alternates.
5. **Cache aggressively** (long CDN/`Cache-Control`); invalidate via existing PRODUCT\_\* / catalog webhook tags. Mega catalogs may need a background export / blob rather than GraphQL-at-request.
6. Ship **`robots.ts` first** (disallow `noIndexPaths`, eventually `Sitemap:` → index URL), then chunked sitemaps.

| Catalog size              | Approach                                                            |
| ------------------------- | ------------------------------------------------------------------- |
| Demo / ≲5k SKUs × few L×C | Few chunks; on-demand GraphQL OK                                    |
| Mid (tens of k)           | `generateSitemaps` + cursor pagination per channel                  |
| Huge (100k+)              | Precompute / background pipeline; storefront serves cached XML only |

## Disabling SEO

To remove SEO features entirely:

1. Delete `src/lib/seo/` folder
2. Remove `rootMetadata` / locale `generateMetadata` from layouts
3. Remove `buildPageMetadata`/`buildProductJsonLd` from pages
4. Delete `src/app/api/og/`

## Anti-patterns

❌ **Don't hardcode metadata** — Use the helpers  
❌ **Don't skip JSON-LD on product pages** — Important for search  
❌ **Don't forget `noIndexPaths`** — Exclude checkout, cart  
❌ **Don't set `openGraph.type: "product"`** — Triggers Next E237 and drops all page metadata  
❌ **Don't hoist PDP `og:type` on the sync shell before the product resolves** — 404 URLs would advertise `product`  
❌ **Don't hardcode `og:locale` to `en_US`** — Derive from the URL locale  
❌ **Don't list unpaired locales in `og:locale:alternate`** — When `LOCALE_CHANNELS` is set, alternate locales must match the matrix (same as hreflang)  
❌ **Don't treat DevTools double tags as a Paper SEO bug** — Check streaming metadata / bot UA first  
❌ **Don't add a monolithic `sitemap.ts` that loads every product×locale×channel** — Use index + chunks; see Sitemap & robots above
