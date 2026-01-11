# AI Agent Guidelines for Saleor Storefront

This document provides essential context for AI agents. For detailed task-specific instructions, see the **Skills** in `.claude/skills/`.

---

## Quick Reference

### Critical Commands

```bash
pnpm run generate     # After ANY .graphql file change
pnpm exec tsc --noEmit   # Type check
pnpm run build        # Full build
pnpm run dev          # Development server
pnpm test             # Run tests (watch mode)
```

### When to Use Which Skill

| Task                               | Skill                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------- |
| Modifying `.graphql` files         | [`graphql-workflow`](.claude/skills/graphql-workflow/SKILL.md)         |
| Creating/styling components        | [`ui-components`](.claude/skills/ui-components/SKILL.md)               |
| Product list filtering/sorting     | [`filtering-system`](.claude/skills/filtering-system/SKILL.md)         |
| Understanding Saleor API behavior  | [`saleor-investigation`](.claude/skills/saleor-investigation/SKILL.md) |
| Variant/attribute selection on PDP | [`variant-selection`](.claude/skills/variant-selection/SKILL.md)       |
| Page metadata, JSON-LD, OG images  | [`seo-system`](.claude/skills/seo-system/SKILL.md)                     |
| ISR, webhooks, cache invalidation  | [`caching-strategy`](.claude/skills/caching-strategy/SKILL.md)         |
| Writing tests                      | [`testing`](.claude/skills/testing/SKILL.md)                           |
| Creating/maintaining skills        | [`writing-skills`](.claude/skills/writing-skills/SKILL.md)             |

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
├── gql/                    # AUTO-GENERATED - Do not edit
├── ui/components/          # UI components
│   ├── pdp/                # Product detail page
│   ├── plp/                # Product listing page
│   ├── cart/               # Cart drawer
│   ├── nav/                # Navigation
│   └── ui/                 # Base primitives (Button, Badge, etc.)
├── lib/                    # Utilities
│   ├── seo/                # SEO helpers
│   └── search/             # Search abstraction
└── styles/brand.css        # Design tokens
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
```

---

## Common Gotchas

### 1. GraphQL Types Not Found

```bash
pnpm run generate  # Regenerate types after .graphql changes
```

### 2. Nullable Fields

Saleor has many nullable fields. Always use optional chaining:

```typescript
const name = product.category?.name ?? "Default";
```

### 3. Permission Errors

Some fields require admin permissions. For variant attributes, use:

```graphql
attributes(variantSelection: ALL) {
  values { name value }
  attribute { name slug }
}
```

### 4. Server vs Client Components

Default to Server Components. Only use `"use client"` when you need:

- `useState`, `useEffect`, event handlers
- Browser APIs

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

Each skill is a focused guide for a specific task. Skills are in `.claude/skills/[name]/SKILL.md`.

### Available Skills

1. **[graphql-workflow](.claude/skills/graphql-workflow/SKILL.md)** - Modifying queries, regenerating types
2. **[ui-components](.claude/skills/ui-components/SKILL.md)** - Component patterns, design tokens, shadcn/ui
3. **[filtering-system](.claude/skills/filtering-system/SKILL.md)** - Server/client filtering architecture
4. **[saleor-investigation](.claude/skills/saleor-investigation/SKILL.md)** - Checking Saleor source for API behavior
5. **[variant-selection](.claude/skills/variant-selection/SKILL.md)** - Complex variant/attribute selection
6. **[seo-system](.claude/skills/seo-system/SKILL.md)** - Metadata, JSON-LD, OG images
7. **[caching-strategy](.claude/skills/caching-strategy/SKILL.md)** - ISR, webhooks, cache invalidation
8. **[testing](.claude/skills/testing/SKILL.md)** - Writing fast, effective tests
9. **[writing-skills](.claude/skills/writing-skills/SKILL.md)** - How to create and maintain skills

### Using Skills

When performing a task, reference the relevant skill:

> "Use the `graphql-workflow` skill when modifying any `.graphql` file."

Skills provide detailed instructions, examples, and anti-patterns for each task.
