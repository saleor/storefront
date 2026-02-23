---
name: saleor-paper-storefront
description: >
  Saleor e-commerce storefront patterns for Next.js 16. Use when working with
  product pages, checkout flow, GraphQL queries, caching, variant selection,
  filtering, SEO, or any Saleor API integration. Covers architecture decisions,
  data flow, and project-specific conventions.
license: MIT
metadata:
  author: saleor-paper
  version: "1.0.0"
---

# Saleor Paper Storefront

Comprehensive guide for building and maintaining a Saleor e-commerce storefront
with Next.js 16, TypeScript, and Tailwind CSS. Contains 13 rules across 6
categories, prioritized by impact to guide development, debugging, and
refactoring.

## When to Apply

Reference these guidelines when:

- Working on product detail pages (PDP), variant selection, or filtering
- Modifying checkout flow or payment integration
- Editing GraphQL queries or regenerating types
- Debugging caching, stale content, or revalidation
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

- `data-caching` - Cache Components (PPR), cache tags, revalidation, price flow
- `data-graphql` - Two codegen setups, permission patterns, nullable fields

### 2. Product Pages (HIGH)

- `product-pdp` - PDP architecture, gallery, data flow, add-to-cart, ErrorBoundary
- `product-variants` - Variant selection state machine, option states, discount badges
- `product-filtering` - Server vs client filtering, category slug resolution

### 3. Checkout Flow (HIGH)

- `checkout-management` - Checkout lifecycle, cookie storage, payment debugging
- `checkout-components` - Reusable checkout UI (SignInForm, AddressSelector, PaymentMethodSelector)

### 4. UI & Channels (MEDIUM)

- `ui-components` - Design tokens, shadcn/ui primitives, component locations
- `ui-channels` - Multi-channel URLs, fulfillment model, purchasability debugging, channel selector

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

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
