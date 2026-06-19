---
name: saleor-paper-storefront
description: >
  Project-specific patterns for the Saleor Paper storefront built with Next.js 16,
  TypeScript, and Tailwind CSS. Use when working with product pages, checkout flow,
  caching, variant selection, filtering, SEO, or UI components. For universal Saleor
  API patterns, see the saleor-storefront dependency.
license: MIT
metadata:
  author: saleor-paper
  version: "1.8.0"
dependencies:
  - saleor/agent-skills#saleor-storefront
---

# Saleor Paper Storefront

Project-specific guide for the Saleor Paper storefront — a Next.js 16 e-commerce
application with TypeScript, Tailwind CSS, and the Saleor GraphQL API. Contains
27 rules across 8 categories covering architecture, caching, storefront content, PDP architecture, checkout v2,
design & composition (token system, design quality, section catalog, page composition, design-from-image, verification),
components, UI patterns, locale routing, i18n, and SEO.

> **Prerequisite**: This skill depends on [`saleor-storefront`](https://github.com/saleor/agent-skills)
> for universal Saleor API knowledge (data model, permissions, checkout lifecycle,
> channels). Install it alongside this skill.

## When to Apply

**Unfamiliar with the codebase?** Read [`paper-architecture`](rules/paper-architecture.md) first.

Reference these guidelines when:

- Working on product detail pages (PDP), variant selection, or filtering
- Modifying checkout flow or payment integration
- Editing GraphQL queries or regenerating types
- Debugging caching, stale content, or revalidation
- Editing merchandising copy, homepage content, or `CONTENT_PROVIDER=saleor`
- Seeding or extending Saleor Models for storefront content (Configurator)
- Migrating authenticated routes (account, session cookies) under Cache Components / PPR
- Upgrading a forked shop — see **Migrations** below
- Molding PDP or homepage layout/design, or designing from a prompt or reference image
- Creating UI components with design tokens
- Adding locale/channel routing, market picker, next-intl messages, or i18n URL structure
- Adding SEO metadata, JSON-LD, or OG images
- Writing tests or investigating Saleor API behavior

## Rule Categories by Priority

| Priority | Category             | Impact   | Prefix                      |
| -------- | -------------------- | -------- | --------------------------- |
| 0        | Architecture         | CRITICAL | `paper-`                    |
| 1        | Data Layer           | CRITICAL | `data-`                     |
| 2        | Product Pages        | HIGH     | `product-`                  |
| 3        | Checkout Flow        | HIGH     | `checkout-`                 |
| 4        | Design & Composition | HIGH     | `ui-` / `design-` / `page-` |
| 5        | UI & Channels        | MEDIUM   | `ui-`                       |
| 6        | SEO                  | MEDIUM   | `seo-`                      |
| 7        | Development          | MEDIUM   | `dev-`                      |

## Quick Reference

### 0. Architecture (CRITICAL)

- `paper-architecture` - **Start here** — canonical Next.js stance, pillars, non-goals, where to read next

### 1. Data Layer (CRITICAL)

- `data-caching` - Cache Components (PPR), three-layer page model, cache manifest, webhooks
- `data-auth-routes` - BFF auth, `resolveSessionUser`, account PPR, header chrome refresh
- `data-graphql` - Two codegen setups (checkout types via server actions, not urql runtime)
- `data-storefront-content` - Provider-agnostic copy layer, merge semantics, cache tags, wiring
- `data-storefront-content-saleor` - Saleor Models, slug stack, channel overrides, Configurator
- `data-storefront-content-attributes` - Attribute inputTypes, catalog references, scalar roadmap

### 2. Product Pages (HIGH)

- `product-pdp` - ProductShell + dynamic islands, gallery, LCP preload, add-to-cart
- `product-variants` - Variant selection state machine, swatch renderers, partial selection
- `references/variant-selector-ui.md` - Border states, pill/circle sizing, renderer routing (read before editing renderers)
- `product-filtering` - Server vs client filtering, category slug resolution

### 3. Checkout Flow (HIGH)

- `paper-surfaces` - Two surfaces, routes, v2 data flow, session handoff (read `paper-architecture` first)
- `checkout-design-principles` - Evidence-based UX principles (guest-first, mobile, pricing, express pay)
- `checkout-management` - Lifecycle, RSC sync, shallow steps, payment transition UX (+ cheat sheet)
- `checkout-payment-gateways` - Payment app registry, submit modes, Stripe Express Checkout wallets, adding a new gateway
- `checkout-components` - Reusable checkout UI (SignInForm, AddressSelector, billing, integrated payment UI)

### 4. Design & Composition (HIGH)

- `ui-design-system` - **Start here for design** — token vocabulary (color, fluid type, width, rhythm, radius, elevation, motion) + cva variant matrix
- `design-quality-rubric` - World-class bar: hierarchy, whitespace, full-width-allowed clause, mobile non-negotiables, self-check
- `ui-sections` - Marketing-block catalog (HeroBanner, FeaturedCollection, ImageWithText, …), selection guide, section authoring pattern
- `page-composition` - Mold PDP/homepage within the PPR rails (static shell vs dynamic islands)
- `design-from-image` - Prompt/image → brief → tokens → blocks → compose → verify
- `design-verification` - Gates: hard-fail token lint, advisory PPR/LCP/client-JS, a11y pass

### 5. UI & Channels (MEDIUM)

- `references/code-conventions.md` - kebab-case files, PascalCase exports, `@/` imports
- `ui-components` - Design tokens, shadcn/ui primitives, component locations
- `ui-channels` - Channel allowlist, fulfillment triangle, multi-currency, channel selector
- `ui-locale-routing` - `/{locale}/{channel}/` routing, middleware redirects, path helpers
- `ui-i18n` - next-intl namespaces, server/client patterns, ADR 0002 boundary

### 6. SEO (MEDIUM)

- `seo-metadata` - JSON-LD structured data, metadata helpers, OG image generation

### 7. Development (MEDIUM)

- `dev-investigation` - Saleor API source code investigation methodology

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/data-caching.md
rules/product-variants.md
```

Each rule file contains:

- Brief explanation of why it matters
- File locations and architecture diagrams
- Code examples (correct and incorrect patterns)
- Anti-patterns to avoid

## Migrations (fork upgrades)

Chronological upgrade prompts for forks behind upstream Paper. **Not** for greenfield work — use `rules/` for current patterns.

| Task                   | Location                         |
| ---------------------- | -------------------------------- |
| Apply pending upgrades | `migrations/SKILL.md`            |
| Migration registry     | `migrations/manifest.json`       |
| Fork baseline          | `paper-version.json` (repo root) |

Trigger phrases: "upgrade Paper", "apply Paper migrations", "catch up with upstream caching", "checkout v2", "paper-version".

Notable migration: `2026-06-checkout-v2` — **subsystem replacement** (adopt-then-replay, not incremental port); RSC + server actions; requires `2026-06-account-ppr-auth`. See `migrations/references/checkout-v2-overview.md`.

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md` (regenerate from `rules/` with `node scripts/compile-agents.mjs`)
