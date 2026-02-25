# AI Agent Guidelines for Saleor Storefront

This document provides essential context for AI agents working on this codebase. It is self-contained — any agent (Claude, Codex, Copilot, Cursor) reading only this file should be productive. For Claude Code users, this project also has a [skill](skills/saleor-paper-storefront/SKILL.md) with 16 detailed rule files.

---

## Quick Reference

### Dev Commands

```bash
pnpm dev                    # Start dev server (webpack, HMR) — auto-runs codegen
pnpm dev:turbopack           # Start dev server (turbopack)
pnpm build                   # Production build — auto-runs codegen
pnpm generate                # Regenerate storefront GraphQL types (src/gql/)
pnpm generate:checkout       # Regenerate checkout GraphQL types (src/checkout/graphql/generated/)
pnpm test                    # Run Vitest (watch mode)
pnpm test:run                # Run Vitest (single run, CI)
pnpm lint                    # ESLint
pnpm lint:fix                # ESLint with auto-fix
pnpm knip                    # Detect unused exports/dependencies
```

**After editing any `.graphql` file**, run the appropriate `generate` command before building or committing.

### Code Style

- TypeScript strict mode — no `any`, no `as` type assertions unless unavoidable
- Tailwind CSS for all styling — no inline styles, no CSS modules
- Import paths use `@/` alias (maps to `src/`)
- Server Components by default — only `"use client"` when hooks/interactivity needed
- GraphQL results: always check `result.ok` before accessing `result.data`
- Pre-commit hooks: ESLint + Prettier run automatically via husky/lint-staged

### Testing

Run `pnpm test:run` before committing. The project has 2 test files covering variant selection and filter utilities — see `rules/dev-testing.md` for conventions and where to add new tests. Test environment is Node (not jsdom) — don't test React component rendering directly.

---

## I Want To...

| Task                         | Start Here                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| Add a new GraphQL field      | `rules/data-graphql.md` → Making Changes                                                 |
| Add a new storefront page    | `rules/dev-new-page.md` → Recipe                                                         |
| Add a product page feature   | `rules/product-pdp.md` → Data Flow                                                       |
| Debug checkout issues        | `rules/dev-investigation.md` → Checkout Diagnostic                                       |
| Debug payment failures       | `rules/checkout-management.md` → Payment Transaction Flow + `rules/dev-investigation.md` |
| Fix caching / stale data     | `rules/data-caching.md` → Debugging Checklist                                            |
| Handle a new webhook event   | `rules/webhook-handlers.md` → Adding New Events                                          |
| Modify cart behavior         | `rules/checkout-cart.md` → Cart Mutations                                                |
| Understand variant selection | `rules/product-variants.md` → State Machine                                              |
| Write a Server Action        | `rules/data-graphql.md` → Server Actions with GraphQL                                    |
| Write tests                  | `rules/dev-testing.md` → Where to Add Tests First                                        |
| Understand Saleor concepts   | `references/saleor-glossary.md` + `references/saleor-domain-model.md`                    |

All rule/reference paths are relative to `skills/saleor-paper-storefront/`.

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with CSS custom properties
- **UI**: @headlessui/react, Radix UI (dialog, dropdown), lucide-react icons
- **GraphQL**: Saleor API with `graphql-codegen`
- **State**: Server-side (cookies + server actions for cart data), urql (checkout queries)

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

### Key File Paths

```
src/lib/graphql.ts                    — GraphQL execution, GraphQLResult<T>, RequestQueue
src/lib/checkout.ts                   — findOrCreate, getIdFromCookies, cookie management
src/graphql/*.graphql                 — Storefront queries/mutations
src/checkout/graphql/*.graphql        — Checkout queries/mutations
src/gql/graphql.ts                    — Generated storefront types (DO NOT EDIT)
src/checkout/graphql/generated/       — Generated checkout types (DO NOT EDIT)
src/app/[channel]/(main)/            — All storefront pages
src/app/api/revalidate/              — Webhook-driven cache invalidation
src/ui/components/                    — Shared UI components
src/checkout/components/              — Checkout-specific UI components
src/styles/brand.css                  — Design tokens
vitest.config.ts                      — Test configuration
```

### Critical Architecture Decisions

- **GraphQL execution**: Never throws — returns `GraphQLResult<T>` discriminated union. Always check `result.ok` before accessing `result.data`
- **Two codegen setups**: Storefront (`src/graphql/` → `src/gql/`) and Checkout (`src/checkout/graphql/` → `src/checkout/graphql/generated/`). Don't mix them
- **Server Actions**: `"use server"` → `executeAuthenticatedGraphQL()` → `revalidatePath()`. No client-side state for cart/checkout
- **Caching**: PPR with `"use cache"` + tag-based revalidation from webhooks. Mutations always use `cache: "no-cache"`
- **Routing**: All storefront pages under `src/app/[channel]/(main)/`. Channel from URL params, never hardcoded
- **Auth fallback**: `executeAuthenticatedGraphQL` falls back to unauthenticated during static generation (`DYNAMIC_SERVER_USAGE`)
- **Components**: Default Server Components. Only `"use client"` for hooks, interactivity, or `@headlessui/react`
- **Checkout cookies**: `checkoutId-{channel}` cookie, per-channel. Not httpOnly (accessible from client JS for checkout redirect flows)

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

## Anti-patterns (Global)

- Don't edit generated files (`src/gql/`, `src/checkout/graphql/generated/`)
- Don't destructure GraphQL results without checking `result.ok`
- Don't hardcode channel slugs — use `params.channel`
- Don't add `"use client"` to page files — extract interactivity into child components
- Don't use `cache: "no-cache"` on read queries (use `revalidate`)
- Don't skip `revalidatePath()` after mutations
- Don't omit `errors { field message code }` from GraphQL mutations

---

## Rule Files Reference

16 rules across 6 categories, in `skills/saleor-paper-storefront/rules/`:

### 1. Data Layer (CRITICAL)

- `data-caching` - Cache Components (PPR), cache tags, revalidation, price flow
- `data-graphql` - Two codegen setups, execution functions, Server Actions, mutations, rate limiting
- `data-error-handling` - GraphQLResult<T> pattern, 4 error layers, getUserMessage, validation errors
- `data-auth-patterns` - Client/server auth, token flow, login, registration, password reset
- `webhook-handlers` - Revalidation webhooks, HMAC verification, rate limiting, adding events

### 2. Product Pages (HIGH)

- `product-pdp` - PDP architecture, gallery, data flow, add-to-cart, ErrorBoundary
- `product-variants` - Variant selection state machine, option states, discount badges
- `product-filtering` - Server vs client filtering, category slug resolution

### 3. Checkout Flow (HIGH)

- `checkout-management` - Checkout lifecycle, cookie storage, payment transactions, checkout components, debugging
- `checkout-cart` - Cart mutations, add-to-cart action, line items, cart badge, cookie management

### 4. UI & Channels (MEDIUM)

- `ui-components` - Design tokens, @headlessui primitives, Server/Client component split
- `ui-channels` - Multi-channel URLs, fulfillment model, purchasability debugging, channel selector

### 5. SEO (MEDIUM)

- `seo-metadata` - JSON-LD structured data, metadata helpers, OG image generation

### 6. Development (MEDIUM)

- `dev-investigation` - Saleor API investigation, GraphQL Playground, Dashboard patterns
- `dev-testing` - Vitest config, testing strategy, highest-value test targets
- `dev-new-page` - Adding routes, [channel] pattern, data fetching, metadata, caching

### References

Saleor domain knowledge in `skills/saleor-paper-storefront/references/`:

- `saleor-domain-model.md` — Entity relationships, ER diagram, GraphQL type patterns
- `saleor-glossary.md` — Non-obvious Saleor terms that commonly cause confusion

---

## Skills (for agents with skill support)

### Project Skill

**[saleor-paper-storefront](skills/saleor-paper-storefront/SKILL.md)** — 16 rules covering all Saleor storefront patterns. Follows the [agentskills.io](https://agentskills.io) specification.

### Installed Community Skills

Installed via `npx skills add vercel-labs/agent-skills`:

1. **[vercel-react-best-practices](.agents/skills/vercel-react-best-practices/SKILL.md)** - 57 React/Next.js performance rules
2. **[vercel-composition-patterns](.agents/skills/vercel-composition-patterns/SKILL.md)** - React composition patterns (compound components, state management)
3. **[web-design-guidelines](.agents/skills/web-design-guidelines/SKILL.md)** - 100+ accessibility, UX, and performance rules
