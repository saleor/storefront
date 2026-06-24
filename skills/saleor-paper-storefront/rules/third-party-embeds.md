# Third-Party Widget Embeds

How to add external marketing widgets (reviews, ratings, social proof loaders) without breaking Paper's Server Component / PPR architecture or performance budget.

> Read together with [`page-composition`](page-composition.md) (where embeds live on PDP), [`product-pdp`](product-pdp.md) (shell vs islands), [`design-verification`](design-verification.md) (gates).

---

## When to use

- Reviews/ratings providers (Yotpo, Judge.me, etc.)
- Social proof or UGC widgets loaded from a vendor script
- Any `next/script` third-party loader on browse surfaces

For **static** social proof without a live vendor API, prefer [`ui-sections`](ui-sections.md) (`TestimonialSection`) with content-layer copy.

---

## Architecture

```
ProductShell (Server — cached, no scripts)
├── static sections (h1, breadcrumbs, …)
├── YotpoStarSummary (client leaf — optional, near title)
└── …
└── Suspense islands (gallery, buy box)

Below buy box / accordion (still in shell, static placement):
└── YotpoReviewsWidget (client leaf — loads script + widget div)
```

| Layer               | Rule                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Script loader**   | `"use client"` leaf component only — never in `ProductShell` as inline `<script>`                                                       |
| **Env keys**        | `NEXT_PUBLIC_*` for app/widget keys; never commit real keys; document in `.env.example`                                                 |
| **Load strategy**   | `next/script` with `strategy="lazyOnload"` (below-the-fold widgets) or `afterInteractive` when above-the-fold summary needs early paint |
| **Product mapping** | Pass Saleor `product.id` or a stable external SKU the vendor expects — confirm with the developer                                       |
| **PPR**             | Embed components are static nodes in the shell; they must not read `searchParams` or `cookies()`                                        |

---

## Yotpo pattern (reference)

```tsx
"use client";

import Script from "next/script";

const APP_KEY = process.env.NEXT_PUBLIC_YOTPO_APP_KEY;

export function YotpoReviewsWidget({
	productId,
	productName,
	productUrl,
	productImageUrl,
}: {
	productId: string;
	productName: string;
	productUrl: string;
	productImageUrl?: string | null;
}) {
	if (!APP_KEY) return null;

	return (
		<>
			<Script src={`https://staticw2.yotpo.com/${APP_KEY}/widget.js`} strategy="lazyOnload" />
			<div
				className="yotpo yotpo-main-widget"
				data-product-id={productId}
				data-name={productName}
				data-url={productUrl}
				data-image-url={productImageUrl ?? undefined}
			/>
		</>
	);
}
```

Star summary near the title: separate small client component or the vendor's star-rating widget div — same `APP_KEY`, anchor link down to the full widget.

**Agent checklist before implementing:**

1. Ask for `NEXT_PUBLIC_YOTPO_APP_KEY` and which widget (Reviews vs Star Ratings).
2. Confirm product-id mapping (Saleor global id vs external SKU).
3. Add placeholder to `.env.example`; developer adds real key to `.env.local` (do not echo the key in chat logs).
4. Compose in `ProductShell` below the buy box or accordion — not inside `VariantSectionDynamic`.

---

## Anti-patterns

❌ **Inline `<script>` tags in Server Components** — use `next/script` in a client leaf  
❌ **Blocking `beforeInteractive` scripts** for below-the-fold reviews — hurts LCP  
❌ **Hardcoding API keys** in components — env vars only  
❌ **Putting embeds inside Suspense islands** that read `searchParams` — keep placement in the static shell  
❌ **Skipping the developer question** on keys and product-id mapping — vendor widgets fail silently without them
