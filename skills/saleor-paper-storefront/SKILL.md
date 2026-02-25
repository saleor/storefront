---
name: saleor-paper-storefront
description: >
  Saleor e-commerce storefront patterns for Next.js 16. Use when working with
  product pages, checkout flow, cart operations, GraphQL queries, caching,
  variant selection, filtering, SEO, authentication, webhooks, error handling,
  testing, adding new pages, or any Saleor API integration. Also covers Saleor
  domain knowledge: entity relationships, GraphQL types, terminology, and
  webhook events. Covers architecture decisions, data flow, and
  project-specific conventions.
license: MIT
metadata:
  author: saleor-paper
  version: "4.1.0"
---

# Saleor Paper Storefront

Comprehensive guide for building and maintaining a Saleor e-commerce storefront with Next.js 16, TypeScript, and Tailwind CSS. Contains 16 rules across 6 categories, prioritized by impact.

For the full project context (dev commands, architecture, env vars, gotchas, anti-patterns), see [`AGENTS.md`](../../AGENTS.md) at the project root.

## Rule Categories by Priority

| Priority | Category      | Impact   | Prefix      |
| -------- | ------------- | -------- | ----------- |
| 1        | Data Layer    | CRITICAL | `data-`     |
| 2        | Product Pages | HIGH     | `product-`  |
| 3        | Checkout Flow | HIGH     | `checkout-` |
| 4        | UI & Channels | MEDIUM   | `ui-`       |
| 5        | SEO           | MEDIUM   | `seo-`      |
| 6        | Development   | MEDIUM   | `dev-`      |

## Rules

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

## References

Saleor domain knowledge:

- `references/saleor-domain-model.md` — Entity relationships, ER diagram, GraphQL type patterns
- `references/saleor-glossary.md` — Non-obvious Saleor terms that commonly cause confusion
