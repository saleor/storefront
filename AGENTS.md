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

Skills are organized in two locations:

| Location                          | Purpose                           | Contents                                                                 |
| --------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `skills/saleor-paper-storefront/` | Project-specific domain knowledge | 13 rules covering caching, PDP, checkout, GraphQL, etc.                  |
| `.agents/skills/`                 | Installed community skills        | Vercel React best practices, composition patterns, web design guidelines |

### When to Use Which Skill

**Project skill** ([`saleor-paper-storefront`](skills/saleor-paper-storefront/SKILL.md)) -- use for all Saleor storefront tasks:

| Task                           | Rule                  |
| ------------------------------ | --------------------- |
| Modifying `.graphql` files     | `data-graphql`        |
| Caching, ISR, webhooks         | `data-caching`        |
| Product detail page (PDP)      | `product-pdp`         |
| Variant/attribute selection    | `product-variants`    |
| Product list filtering/sorting | `product-filtering`   |
| Checkout flow debugging        | `checkout-management` |
| Checkout UI components         | `checkout-components` |
| Creating/styling components    | `ui-components`       |
| Channels, fulfillment & stock  | `ui-channels`         |
| SEO, metadata, OG images       | `seo-metadata`        |
| Investigating Saleor API       | `dev-investigation`   |

**Community skills** (`.agents/skills/`) -- use for generic best practices:

| Task                           | Skill                         |
| ------------------------------ | ----------------------------- |
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
- **State**: React Context (cart), Zustand (checkout only)

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [channel]/          # Channel-scoped routes
│   │   └── (main)/         # Main layout (header/footer)
│   ├── api/                # API routes (og/, revalidate/)
│   └── checkout/           # Checkout flow
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

# Rate Limiting (for build-time API calls)
SALEOR_MAX_CONCURRENT_REQUESTS=3   # Max parallel requests to Saleor (default: 3)
SALEOR_MIN_REQUEST_DELAY_MS=200    # Min delay between requests in ms (default: 200)
SALEOR_REQUEST_TIMEOUT_MS=15000    # Request timeout in ms (default: 15000)
NEXT_BUILD_RETRIES=1               # GraphQL retries during build (default: 3, use 1 for flaky APIs)

# Channel Configuration (required)
NEXT_PUBLIC_DEFAULT_CHANNEL=       # Your Saleor channel slug (e.g., "default-channel")

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

| Layer            | TTL          | Purpose                |
| ---------------- | ------------ | ---------------------- |
| ISR              | 5 min        | Product/category pages |
| GraphQL          | 5 min - 1 hr | API responses          |
| Static Assets    | 1 year       | JS/CSS bundles         |
| Category Lookups | 1 hour       | Slug → ID resolution   |

### On-Demand Revalidation

```bash
curl "/api/revalidate?secret=xxx&path=/channel/products/slug"
```

Or configure Saleor webhooks pointing to `/api/revalidate`.

---

## Skills Reference

### Project Skill

**[saleor-paper-storefront](skills/saleor-paper-storefront/SKILL.md)** -- 13 rules covering all Saleor storefront patterns. Follows the [agentskills.io](https://agentskills.io) specification.

Rules by category:

1. **Data Layer** (CRITICAL): `data-caching`, `data-graphql`
2. **Product Pages** (HIGH): `product-pdp`, `product-variants`, `product-filtering`
3. **Checkout Flow** (HIGH): `checkout-management`, `checkout-components`
4. **UI & Channels** (MEDIUM): `ui-components`, `ui-channels`
5. **SEO** (MEDIUM): `seo-metadata`
6. **Development** (MEDIUM): `dev-investigation`

Full compiled document: [`skills/saleor-paper-storefront/AGENTS.md`](skills/saleor-paper-storefront/AGENTS.md)

### Installed Community Skills

Installed via `npx skills add vercel-labs/agent-skills`:

1. **[vercel-react-best-practices](.agents/skills/vercel-react-best-practices/SKILL.md)** - 57 React/Next.js performance rules
2. **[vercel-composition-patterns](.agents/skills/vercel-composition-patterns/SKILL.md)** - React composition patterns (compound components, state management)
3. **[web-design-guidelines](.agents/skills/web-design-guidelines/SKILL.md)** - 100+ accessibility, UX, and performance rules
