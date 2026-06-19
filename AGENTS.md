# AI Agent Guidelines for Saleor Storefront

This document provides essential context for AI agents. For detailed task-specific instructions, see the **Skills** below.

---

## Quick Reference

### Critical Commands

```bash
pnpm run generate           # After ANY src/graphql/*.graphql file change
pnpm run generate:checkout  # After ANY src/checkout/graphql/*.graphql file change
pnpm exec tsc --noEmit      # Type check
pnpm run build              # Full build
pnpm run dev                # Development server
pnpm test                   # Run tests (watch mode)
```

### Skills Architecture

Skills are organized as follows:

| Location                                                      | Purpose                           | Contents                                                                 |
| ------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `skills/saleor-paper-storefront/`                             | Project-specific domain knowledge | 27 rules + fork migrations under `migrations/`                           |
| `skills-lock.json`                                            | External skill version pins       | Restored via `pnpm skills:bootstrap` → `npx skills experimental_install` |
| [saleor/agent-skills](https://github.com/saleor/agent-skills) | Universal & community skills      | Upstream source for `saleor-storefront` and optional Vercel skills       |

### When to Use Which Skill

**Project skill** ([`saleor-paper-storefront`](skills/saleor-paper-storefront/SKILL.md)) -- use for all Saleor storefront tasks:

| Task                               | Rule                                 |
| ---------------------------------- | ------------------------------------ |
| Architecture / canonical Next.js   | `paper-architecture`                 |
| Modifying `.graphql` files         | `data-graphql`                       |
| Caching, ISR, webhooks             | `data-caching`                       |
| Storefront marketing copy layer    | `data-storefront-content`            |
| Saleor Models for storefront copy  | `data-storefront-content-saleor`     |
| Storefront content attribute types | `data-storefront-content-attributes` |
| Product detail page (PDP)          | `product-pdp`                        |
| Variant/attribute selection        | `product-variants`                   |
| Product list filtering/sorting     | `product-filtering`                  |
| Storefront vs checkout surfaces    | `paper-surfaces`                     |
| Checkout flow debugging            | `checkout-management`                |
| BFF auth, session, PPR account     | `data-auth-routes`                   |
| Adding a payment gateway           | `checkout-payment-gateways`          |
| Checkout UX / design principles    | `checkout-design-principles`         |
| Checkout UI components             | `checkout-components`                |
| Design tokens & variant matrix     | `ui-design-system`                   |
| Design quality / world-class bar   | `design-quality-rubric`              |
| Marketing section catalog          | `ui-sections`                        |
| Molding PDP / homepage layout      | `page-composition`                   |
| Designing from a prompt or image   | `design-from-image`                  |
| Verifying design (gates, a11y)     | `design-verification`                |
| Creating/styling components        | `ui-components`                      |
| Channels, fulfillment & stock      | `ui-channels`                        |
| Locale + channel URL routing       | `ui-locale-routing`                  |
| Code-owned UI strings (next-intl)  | `ui-i18n`                            |
| SEO, metadata, OG images           | `seo-metadata`                       |
| Investigating Saleor API           | `dev-investigation`                  |
| Upgrading a forked Paper shop      | `migrations/SKILL.md`                |

**External skills** — pinned in `skills-lock.json`; after clone run `pnpm skills:bootstrap`. Maintainers add skills with `npx skills add …` and commit the lockfile.

| Task                           | Skill                         |
| ------------------------------ | ----------------------------- |
| Saleor GraphQL API patterns    | `saleor-storefront`           |
| Writing React components       | `vercel-react-best-practices` |
| Component composition patterns | `vercel-composition-patterns` |
| UI accessibility/UX review     | `web-design-guidelines`       |

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with CSS custom properties
- **UI Components**: shadcn/ui pattern (Radix UI primitives)
- **GraphQL**: Saleor API with `graphql-codegen`
- **State**: React Context (cart + checkout); server actions for mutations

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (og/, revalidate/)
│   ├── (storefront)/[locale]/[channel]/  # Browse, cart, account
│   └── (checkout)/checkout/     # Checkout surface
├── session-bridge/         # @paper/session-bridge (cross-surface only)
├── checkout/               # Checkout flow (do not import from storefront)
├── graphql/                # GraphQL queries (run `pnpm run generate` after changes)
├── gql/                    # AUTO-GENERATED - Do not edit (storefront types)
├── ui/components/          # UI components
│   ├── pdp/                # Product detail page
│   ├── plp/                # Product listing page
│   ├── cart/               # Cart drawer
│   ├── nav/                # Navigation
│   └── ui/                 # Base primitives (Button, Badge, etc.)
├── lib/                    # Utilities
│   ├── seo/                # SEO helpers
│   └── search/             # Search abstraction
└── styles/brand.css        # Design tokens (CSS variables)
```

### Checkout v2 (high level)

Two surfaces in one Next.js app — see `rules/paper-surfaces.md`:

| Route                       | Purpose                                                     |
| --------------------------- | ----------------------------------------------------------- |
| `/checkout?checkout=`       | Active cart — `CheckoutSessionLoader` (RSC) → `CheckoutApp` |
| `/checkout/complete?order=` | Order confirmation — separate RSC page                      |

- **Data:** RSC fetches checkout + `me`; mutations in `src/app/(checkout)/actions.ts`; `useCheckout()` reads `CheckoutDataProvider` (not urql).
- **Steps:** `?step=` via shallow `updateCheckoutQuery()` — do not use `router.replace` for step-only changes.
- **Handoff:** `@paper/session-bridge` only cross-surface import; storefront must not import `@/checkout/*`.
- **Auth:** BFF `/api/auth/*` + `resolveSessionUser()` (`guest` / `authenticated` / `unavailable`); see `data-auth-routes.md`.

---

## Environment Variables

```env
# Required
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/

# Optional
NEXT_PUBLIC_STOREFRONT_URL=   # For canonical URLs and OG images
REVALIDATE_SECRET=            # Manual cache invalidation
SALEOR_WEBHOOK_SECRET=        # Webhook HMAC verification
SALEOR_APP_TOKEN=             # For channels query (server-side only)
CONTENT_PROVIDER=             # Storefront copy: code (default) | saleor (Saleor Models)

# Rate Limiting (for build-time API calls)
SALEOR_MAX_CONCURRENT_REQUESTS=3   # Max parallel requests to Saleor (default: 3)
SALEOR_MIN_REQUEST_DELAY_MS=200    # Min delay between requests in ms (default: 200)
SALEOR_REQUEST_TIMEOUT_MS=15000    # Request timeout in ms (default: 15000)
NEXT_BUILD_RETRIES=1               # GraphQL retries during build (default: 3, use 1 for flaky APIs)

# Channel Configuration (required)
NEXT_PUBLIC_DEFAULT_CHANNEL=       # Your Saleor channel slug (e.g., "default-channel")

# Locale configuration (optional)
NEXT_PUBLIC_DEFAULT_LOCALE=en      # Default URL locale slug
NEXT_PUBLIC_STOREFRONT_LOCALES=en,pl,de,fr,fi,nb  # Enabled locale slugs

# Multi-channel builds (optional) - discovers additional channels at build time
# SALEOR_APP_TOKEN=                # If set, fetches all active channels from API

# Note: Product pages are NOT pre-rendered (all on-demand via ISR) due to Cache Components limitations
```

---

## Common Gotchas

### 1. GraphQL Types Not Found

```bash
pnpm run generate           # Regenerate types after src/graphql/*.graphql changes
pnpm run generate:checkout  # Regenerate types after src/checkout/graphql/*.graphql changes
```

### 2. Nullable Fields

Saleor's GraphQL schema has many nullable fields. Check the generated types and handle nulls intentionally -- optional chaining with a fallback for display values, early returns or errors when null indicates a real problem:

```typescript
// Display value with fallback
const name = product.category?.name ?? "Uncategorized";

// Guard when null means something is wrong
if (!product.defaultVariant) {
	throw new Error(`Product ${product.slug} has no default variant`);
}
```

### 3. Permission Errors

Some Saleor GraphQL fields require admin permissions. If you see `"To access this path, you need one of the following permissions: MANAGE_..."`, the field isn't available to anonymous/customer tokens. Either remove it from the storefront query or fetch it server-side with `SALEOR_APP_TOKEN`.

### 4. Server vs Client Components

Default to Server Components. Only use `"use client"` when you need:

- `useState`, `useEffect`, event handlers
- Browser APIs

### 5. GraphQL Auth Defaults

Two explicit GraphQL helpers ensure you always know what data access level you're using:

```typescript
import { executePublicGraphQL, executeAuthenticatedGraphQL } from "@/lib/graphql";

// Public queries (menus, products, categories) - no auth, only public data
await executePublicGraphQL(MenuDocument, {
	variables: { slug: "footer" },
});

// User queries - requires session cookies
try {
	const { me } = await executeAuthenticatedGraphQL(CurrentUserDocument, { cache: "no-cache" });
} catch {
	// Expired token = not logged in
}

// Checkout/cart mutations - requires session cookies
await executeAuthenticatedGraphQL(CheckoutAddLineDocument, {
	variables: { id: checkoutId, productVariantId: variantId },
	cache: "no-cache",
});
```

### 6. State-to-State Sync in Effects

Don't derive state in effects -- compute inline or in the handler:

```tsx
// Bad - extra render, hard to trace
useEffect(() => {
	setDerivedValue(computeFrom(sourceValue));
}, [sourceValue]);

// Good - compute inline
const derivedValue = computeFrom(sourceValue);
```

### 7. Child Updating Parent State via Effect

Don't use effects to push state up to a parent on mount:

```tsx
// Bad - child uses effect to update parent
useEffect(() => {
	onLayoutChange(true);
}, []);

// Good - parent derives state from what it knows, or callback on user action
```

---

## Caching Strategy

| Layer               | TTL                | Purpose                                                                    |
| ------------------- | ------------------ | -------------------------------------------------------------------------- |
| ISR / `"use cache"` | ~5 min (`catalog`) | Product/category pages — **per locale** via `localeSlug` in cached fetches |
| GraphQL (cached)    | 5 min - 1 hr       | Translated catalog payloads in `"use cache"` functions                     |
| Static Assets       | 1 year             | JS/CSS bundles                                                             |
| Category Lookups    | 1 hour             | Slug → ID resolution                                                       |

Catalog cache **keys** include locale (function arguments); **tags** stay slug-scoped (`product:{slug}`) with path fan-out across locales on webhook. Storefront content uses `storefront-content:{channel}:{locale}`. Details: `skills/saleor-paper-storefront/rules/data-caching.md`.

### On-Demand Revalidation

```bash
curl -H "Authorization: Bearer <REVALIDATE_SECRET>" \
  "https://store.com/api/revalidate?tag=product:slug&path=/pl/default-channel/products/slug"
```

Or configure Saleor webhooks pointing to `/api/revalidate`.

---

## Skills Reference

### Project Skill

**[saleor-paper-storefront](skills/saleor-paper-storefront/SKILL.md)** -- 27 rules covering all Saleor storefront patterns. Follows the [agentskills.io](https://agentskills.io) specification.

Rules by category:

0. **Architecture** (CRITICAL): `paper-architecture`
1. **Data Layer** (CRITICAL): `data-caching`, `data-auth-routes`, `data-graphql`
2. **Product Pages** (HIGH): `product-pdp`, `product-variants`, `product-filtering`
3. **Checkout Flow** (HIGH): `paper-surfaces`, `checkout-design-principles`, `checkout-management`, `checkout-payment-gateways`, `checkout-components`
4. **Design & Composition** (HIGH): `ui-design-system`, `design-quality-rubric`, `ui-sections`, `page-composition`, `design-from-image`, `design-verification`
5. **UI & Channels** (MEDIUM): `ui-components`, `ui-channels`, `ui-locale-routing`, `ui-i18n`
6. **SEO** (MEDIUM): `seo-metadata`
7. **Development** (MEDIUM): `dev-investigation`

**Fork upgrades:** [`skills/saleor-paper-storefront/migrations/SKILL.md`](skills/saleor-paper-storefront/migrations/SKILL.md) — chronological migrations; track state in repo-root [`paper-version.json`](paper-version.json). Trigger: "upgrade Paper", "apply Paper migrations", "catch up with upstream caching".

Full compiled document: [`skills/saleor-paper-storefront/AGENTS.md`](skills/saleor-paper-storefront/AGENTS.md)

### External Skills

Cursor discovers `.agents/skills/` and `.cursor/skills/` — **not** repo-root `skills/`. After clone:

```shell
pnpm skills:bootstrap
```

- Symlinks `skills/saleor-paper-storefront/` into `.agents/skills/` (Paper-specific)
- Runs `npx skills experimental_install` to restore external skills from [`skills-lock.json`](skills-lock.json)

Do **not** run `npx skills add . --skill saleor-paper-storefront` — edit `skills/saleor-paper-storefront/` directly.

**Maintainers** — add or update an external skill (updates `skills-lock.json`):

```shell
npx skills add vercel-labs/agent-skills --skill react-best-practices
git add skills-lock.json
```
