# Adding a New Page

Step-by-step recipe for adding a new route to the storefront. Covers the `[channel]` routing pattern, data fetching, metadata, and caching.

---

## Route Structure

```
src/app/
├── [channel]/                    # Dynamic channel segment (URL: /default-channel/...)
│   └── (main)/                   # Route group — shares Header/Footer layout
│       ├── page.tsx              # Home page
│       ├── products/
│       │   ├── page.tsx          # Product listing
│       │   └── [slug]/page.tsx   # Product detail
│       ├── categories/[slug]/page.tsx
│       ├── collections/[slug]/page.tsx
│       ├── pages/[slug]/page.tsx # CMS pages
│       ├── cart/page.tsx
│       ├── search/page.tsx
│       └── login/page.tsx
├── checkout/                     # Outside (main) — uses minimal layout (no Header/Footer)
└── api/                          # API routes
```

All storefront pages live under `src/app/[channel]/(main)/`. The `[channel]` segment provides multi-channel support (pricing, currency, availability). The `(main)` route group doesn't appear in URLs — it groups pages that share the main layout.

---

## Page Template

Create `src/app/[channel]/(main)/your-page/page.tsx`:

```typescript
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { executePublicGraphQL } from "@/lib/graphql";
import { YourDocument } from "@/gql/graphql";

type Props = {
	params: Promise<{ channel: string; slug: string }>;
};

// Static metadata (simple pages) or dynamic metadata (API-driven pages)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { channel, slug } = await params;
	const result = await executePublicGraphQL(YourDocument, {
		variables: { slug: decodeURIComponent(slug), channel },
		revalidate: 60,
	});
	if (!result.ok || !result.data.item) return {};
	return { title: result.data.item.name };
}

export default async function YourPage({ params }: Props) {
	const { channel, slug } = await params;

	const result = await executePublicGraphQL(YourDocument, {
		variables: { slug: decodeURIComponent(slug), channel },
		revalidate: 60, // ISR — always set for read queries
	});

	if (!result.ok || !result.data.item) {
		notFound();
	}

	return (
		<section className="mx-auto max-w-7xl p-8">
			<h1 className="text-2xl font-bold">{result.data.item.name}</h1>
		</section>
	);
}
```

The `(main)/layout.tsx` provides Header and Footer automatically. For data fetching patterns and server actions, see `data-graphql` rule.

---

## Metadata Patterns

| Page Type             | Pattern                                    | Example                       |
| --------------------- | ------------------------------------------ | ----------------------------- |
| Static content        | `export const metadata`                    | About, Contact, FAQ           |
| Dynamic from API      | `export async function generateMetadata()` | Product, Category, Collection |
| Inherited from layout | Don't export metadata                      | Pages that use parent title   |

Dynamic metadata fetches are automatically deduplicated by Next.js — the same GraphQL query in `generateMetadata` and the page component only executes once.

---

## Layouts

| Layout                                | Provides                                        | Used By              |
| ------------------------------------- | ----------------------------------------------- | -------------------- |
| `src/app/layout.tsx`                  | HTML shell, AuthProvider, fonts, `metadataBase` | All pages            |
| `src/app/[channel]/(main)/layout.tsx` | Header, Footer, main content wrapper            | All storefront pages |
| `src/app/checkout/layout.tsx`         | Minimal wrapper (no Header/Footer)              | Checkout flow        |

---

## Checklist

1. Create file at `src/app/[channel]/(main)/your-page/page.tsx`
2. Accept `params: Promise<{ channel: string }>` and await it
3. Fetch data with `executePublicGraphQL` + `revalidate`
4. Add metadata (static `export const metadata` or dynamic `generateMetadata`)
5. Handle missing data with `notFound()`
6. Use `decodeURIComponent()` on URL slugs
7. For dynamic routes: consider adding `generateStaticParams` for build-time generation

---

## Anti-patterns

- **Don't create pages outside `[channel]/(main)/`** unless they intentionally need a different layout
- **Don't forget `revalidate`** on queries — Without it, pages are fully static and never update
- **Don't call `cookies()` in pages meant for static generation** — This forces dynamic rendering; use `executePublicGraphQL` instead
- **Don't import `"use client"` in page files** — Pages should be Server Components; extract client interactivity into child components
