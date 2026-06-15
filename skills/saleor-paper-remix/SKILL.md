---
name: saleor-paper-remix
description: Adapt a Saleor Paper storefront to a specific commerce domain and data model. Use when the user asks to remix, rebrand, configure, clone a reference store, generate config.yml, use Saleor Configurator, or turn this storefront into a fashion, optical, grocery, electronics, subscription, B2B, or other domain-specific shop.
---

# Saleor Paper Remix

Transform this storefront into a domain-specific store while preserving the current Paper architecture. This is not a color-swap workflow: change the product-card anatomy, PDP sections, filters, navigation, cart messaging, brand tokens, and Saleor Configurator data model to match how customers shop in the chosen domain.

## First Reads

Before editing, read:

- `AGENTS.md`
- `skills/saleor-paper-storefront/SKILL.md`
- `.cursor/conventions.md`
- `src/styles/README.md`
- `src/styles/brand.css`
- `src/config/brand.ts`
- `src/app/config.ts`

Then read the project skill rules that match the files you will touch:

- Storefront vs checkout boundaries: `skills/saleor-paper-storefront/rules/paper-surfaces.md`
- UI components and tokens: `skills/saleor-paper-storefront/rules/ui-components.md`
- PDP changes: `skills/saleor-paper-storefront/rules/product-pdp.md`
- Variant or swatch changes: `skills/saleor-paper-storefront/rules/product-variants.md` and `skills/saleor-paper-storefront/references/variant-selector-ui.md`
- PLP filters/sorting: `skills/saleor-paper-storefront/rules/product-filtering.md`
- Caching and route data: `skills/saleor-paper-storefront/rules/data-caching.md`
- GraphQL changes: `skills/saleor-paper-storefront/rules/data-graphql.md`
- SEO and metadata: `skills/saleor-paper-storefront/rules/seo-metadata.md`
- Checkout UI only if explicitly changing checkout: `paper-surfaces.md`, `checkout-design-principles.md`, `checkout-management.md`, `checkout-payment-gateways.md`, `checkout-components.md`

## Current Architecture Anchors

Use these paths for current Paper:

- Storefront routes: `src/app/(storefront)/[channel]/(main)/`
- Checkout routes: `src/app/(checkout)/checkout/`
- Checkout actions: `src/app/(checkout)/actions.ts`
- Cross-surface handoff only: `src/session-bridge/`
- PLP components: `src/ui/components/plp/`
- Product card base: `src/ui/components/plp/product-card-base.tsx`
- Product card data shape: `src/ui/components/plp/product-card-data.ts`
- Product card quick-add wrapper: `src/ui/components/plp/product-card-with-quick-add.tsx`
- PDP components: `src/ui/components/pdp/`
- Cart drawer: `src/ui/components/cart/cart-drawer.tsx`
- Navigation: `src/ui/components/nav/`
- Footer: `src/ui/components/footer.tsx`
- Brand config: `src/config/brand.ts`
- Brand tokens: `src/styles/brand.css`
- SEO helpers: `src/lib/seo/`
- Configurator target: `config.yml`

Do not use old paths such as `src/app/(main)/`, `src/app/checkout/`, `src/_reference/`, or a checkout-wide urql runtime. If a fork still has old paths, treat that as an upgrade/migration problem and read `skills/saleor-paper-storefront/migrations/SKILL.md`.

## Workflow

1. Study the repo and current branch before changing files.
2. Discover the target domain from a URL, user description, or existing `config.yml`.
3. Produce a short domain profile and get confirmation before large structural edits.
4. Update brand identity, design tokens, and domain-specific storefront structure.
5. Generate or revise `config.yml` for Saleor Configurator.
6. Verify with typecheck/build and, for UI changes, a running app screenshot.

If the product vision is vague, push back and narrow it before coding. A good remix depends on knowing how customers compare, choose, and trust products in that domain.

## Domain Profile

Before editing, summarize:

- Product cards: aspect ratio, primary/secondary information, badges, hover behavior, quick-add rules
- PDP: gallery pattern, key sections, variant selection model, trust signals, sticky mobile bar
- Homepage: hero style, collection sections, category browse pattern
- Navigation: category depth, menu style, special routes
- Filters: domain-specific facets, sort options, mobile behavior
- Cart: threshold, trust signals, upsells, item detail needs
- Data model: channels, product types, attributes, categories, collections, menus

Keep the profile concrete. For example, grocery needs unit pricing and prominent quick-add; optical needs frame shape/material/lens flow; electronics needs specs and compatibility; fashion needs visual swatches and size selection.

## Structural Edit Rules

- Preserve Cache Components patterns: keep `"use cache"`, cache profiles, cache tags, and Suspense islands unless the matching rule says otherwise.
- Keep URL-driven PDP variant selection. Do not bypass the variant state machine or enable add-to-cart without a full variant ID.
- Keep storefront and checkout separated. Storefront may use `@paper/session-bridge`; it must not import `@/checkout/*`.
- Use semantic Tailwind tokens from `src/styles/brand.css`; do not hardcode brand colors in components when a token exists.
- Use Server Components by default and add `"use client"` only for browser state, effects, or event handlers.
- Keep internal imports on the `@/` alias and files in kebab-case.
- If GraphQL files change, run the matching generator: `pnpm run generate` or `pnpm run generate:checkout`.

## Common Edit Map

| Goal                                 | Likely files                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Brand name, tagline, social metadata | `src/config/brand.ts`                                                                                    |
| Colors, radius, dark mode            | `src/styles/brand.css`                                                                                   |
| Homepage structure                   | `src/app/(storefront)/[channel]/(main)/page.tsx`                                                         |
| PLP card anatomy                     | `src/ui/components/plp/product-card-base.tsx`, `product-card-data.ts`, `product-card-with-quick-add.tsx` |
| PLP grid/filter behavior             | `src/ui/components/plp/product-grid.tsx`, `filter-bar.tsx`, `use-product-filters.ts`, `filter-utils.ts`  |
| PDP gallery/sections                 | `src/ui/components/pdp/product-gallery.tsx`, `product-attributes.tsx`, `variant-gallery-dynamic.tsx`     |
| Variant UI                           | `src/ui/components/pdp/variant-selection/`                                                               |
| Header/nav/search                    | `src/ui/components/header.tsx`, `src/ui/components/nav/`                                                 |
| Cart messaging                       | `src/ui/components/cart/cart-drawer.tsx`                                                                 |
| Footer                               | `src/ui/components/footer.tsx`                                                                           |
| SEO                                  | `src/lib/seo/`, `src/app/api/og/route.tsx`                                                               |
| Data model                           | `config.yml`, `CONFIGURATOR.md`                                                                          |

## Configurator Output

Generate `config.yml` from the confirmed domain profile. Include:

- `channels`
- `productAttributes` and `contentAttributes`
- `productTypes` and `pageTypes`
- `categories`
- `collections`
- `products` only when the user wants seed/demo products
- `warehouses`, `shippingZones`, and `taxClasses` when fulfillment or tax assumptions are known
- `menus`
- `pages`

Validate the config before presenting it:

```bash
pnpm dlx @saleor/configurator validate
```

Preview or deploy only when the user provides a target Saleor URL and token:

```bash
pnpm dlx @saleor/configurator diff --url=$SALEOR_URL --token=$SALEOR_TOKEN
pnpm dlx @saleor/configurator deploy --url=$SALEOR_URL --token=$SALEOR_TOKEN
```

## Verification

Run the narrowest meaningful checks:

- TypeScript after code changes: `pnpm exec tsc --noEmit`
- Build for broad route/data changes: `pnpm run build`
- GraphQL generation after `.graphql` edits: `pnpm run generate` or `pnpm run generate:checkout`
- UI verification: start `pnpm run dev`, inspect homepage, PLP, PDP, cart, and any changed checkout path in a browser

When the repo is behind `main`, compare against `main` before relying on old paths:

```bash
git diff --stat "$(git merge-base HEAD main)"..main
git diff --name-status main...HEAD
```

## Portability

This folder is the repo-local Agent Skills package. Install it from a cloned checkout with `npx skills add . --skill saleor-paper-remix --agent '*'`. See `references/portability.md`.
