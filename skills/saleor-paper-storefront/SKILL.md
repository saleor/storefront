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
  version: "1.5.0"
dependencies:
  - saleor/agent-skills#saleor-storefront
---

# Saleor Paper Storefront

Project-specific guide for the Saleor Paper storefront — a Next.js 16 e-commerce
application with TypeScript, Tailwind CSS, and the Saleor GraphQL API. Contains
14 rules across 6 categories covering caching, PDP architecture, checkout v2,
components, UI patterns, and SEO.

> **Prerequisite**: This skill depends on [`saleor-storefront`](https://github.com/saleor/agent-skills)
> for universal Saleor API knowledge (data model, permissions, checkout lifecycle,
> channels). Install it alongside this skill.

## When to Apply

Reference these guidelines when:

- Working on product detail pages (PDP), variant selection, or filtering
- Modifying checkout flow or payment integration
- Editing GraphQL queries or regenerating types
- Debugging caching, stale content, or revalidation
- Migrating authenticated routes (account, session cookies) under Cache Components / PPR
- Upgrading a forked shop — see **Migrations** below
- Creating UI components with design tokens
- Adding SEO metadata, JSON-LD, or OG images
- Writing tests or investigating Saleor API behavior

## Rule Categories by Priority

| Priority | Category      | Impact   | Prefix      |
| -------- | ------------- | -------- | ----------- |
| 1        | Data Layer    | CRITICAL | `data-`     |
| 2        | Product Pages | HIGH     | `product-`  |
| 3        | Checkout Flow | HIGH     | `checkout-` |
| 4        | UI & Channels | MEDIUM   | `ui-`       |
| 5        | SEO           | MEDIUM   | `seo-`      |
| 6        | Development   | MEDIUM   | `dev-`      |

## Quick Reference

### 1. Data Layer (CRITICAL)

- `data-caching` - Cache Components (PPR), three-layer page model, cache manifest, webhooks
- `data-auth-routes` - BFF auth, `resolveSessionUser`, account PPR, header chrome refresh
- `data-graphql` - Two codegen setups (checkout types via server actions, not urql runtime)

### 2. Product Pages (HIGH)

- `product-pdp` - ProductShell + dynamic islands, gallery, LCP preload, add-to-cart
- `product-variants` - Variant selection state machine, swatch renderers, partial selection
- `references/variant-selector-ui.md` - Border states, pill/circle sizing, renderer routing (read before editing renderers)
- `product-filtering` - Server vs client filtering, category slug resolution

### 3. Checkout Flow (HIGH)

- `paper-surfaces` - **Start here for checkout** — surfaces, routes, v2 data flow, session handoff
- `checkout-management` - Lifecycle, RSC sync, shallow steps, payment transition UX (+ cheat sheet)
- `checkout-payment-gateways` - Payment app registry, submit modes, adding a new gateway
- `checkout-components` - Reusable checkout UI (SignInForm, AddressSelector, billing, integrated payment UI)

### 4. UI & Channels (MEDIUM)

- `ui-components` - Design tokens, shadcn/ui primitives, component locations
- `ui-channels` - Channel allowlist, fulfillment triangle, multi-currency, channel selector

### 5. SEO (MEDIUM)

- `seo-metadata` - JSON-LD structured data, metadata helpers, OG image generation

### 6. Development (MEDIUM)

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

Notable migration: `2026-06-checkout-v2` — RSC checkout, server actions, remove urql runtime (requires `2026-06-account-ppr-auth`).

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md` (regenerate from `rules/` with `node scripts/compile-agents.mjs`)
