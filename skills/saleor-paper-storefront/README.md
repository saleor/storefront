# Saleor Paper Storefront Skill

Project-specific agent skill for the Saleor Paper storefront built with Next.js 16, TypeScript, and Tailwind CSS.

> **Depends on**: [`saleor-storefront`](https://github.com/saleor/agent-skills) for universal Saleor API patterns.

## Installation

If working within this repo, the skill is already available in `skills/`. To install it elsewhere for agent auto-discovery:

```shell
# Install this project skill
npx skills add . --skill saleor-paper-storefront

# Install the universal Saleor skill (dependency)
npx skills add saleor/agent-skills --skill saleor-storefront
```

## What's Included

17 rules across 6 categories covering the full storefront:

| Category      | Rules                                                                                                                     | Topics                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Data Layer    | `data-caching`, `data-auth-routes`, `data-graphql`, `data-storefront-content`, `data-storefront-content-saleor`           | Cache, auth, GraphQL, merchandising copy, Saleor Models      |
| Product Pages | `product-pdp`, `product-variants`, `product-filtering`                                                                    | PDP architecture, variant selection, server/client filtering |
| Checkout      | `paper-surfaces`, `checkout-design-principles`, `checkout-management`, `checkout-payment-gateways`, `checkout-components` | Checkout v2, UX principles, lifecycle, payments, UI          |
| UI & Channels | `ui-components`, `ui-channels`                                                                                            | Design tokens, multi-currency                                |
| SEO           | `seo-metadata`                                                                                                            | JSON-LD, OG images, metadata                                 |
| Development   | `dev-investigation`                                                                                                       | Saleor API investigation via generated types and source      |

## Structure

```
saleor-paper-storefront/
├── SKILL.md              # Overview and quick reference (agents read this first)
├── AGENTS.md             # Full compiled document — regenerate: `node scripts/compile-agents.mjs`
├── scripts/
│   └── compile-agents.mjs
├── README.md             # This file (for humans)
├── rules/                # Individual rule files
│   ├── data-caching.md
│   ├── data-auth-routes.md
│   ├── data-graphql.md
│   ├── paper-surfaces.md
│   ├── product-pdp.md
│   ├── product-variants.md
│   ├── product-filtering.md
│   ├── checkout-management.md
│   ├── checkout-payment-gateways.md
│   ├── checkout-components.md
│   ├── ui-components.md
│   ├── ui-channels.md
│   ├── seo-metadata.md
│   └── dev-investigation.md
├── migrations/         # Fork upgrade prompts (chronological)
│   ├── SKILL.md        # Orchestrator — read when upgrading a fork
│   ├── manifest.json   # Ordered registry + upstream SHAs
│   └── atomic/         # One folder per migration
└── references/           # Supporting deep-dive documentation
    ├── variant-selector-ui.md   # Renderer routing, border states, swatch pills
    ├── variant-state-machine.md
    ├── variant-utils-reference.md
    └── saleor-key-directories.md
```

## Upgrading a fork

If you forked Paper and want to catch up with upstream changes (without losing custom styling):

1. Pull latest `skills/saleor-paper-storefront/migrations/` from upstream.
2. Check repo-root [`paper-version.json`](../../paper-version.json) — lists applied migrations.
3. Ask your AI agent: **"Apply pending Paper migrations"** — it should read [`migrations/SKILL.md`](migrations/SKILL.md).
4. Migrations port **architecture and behavior**, not your brand styling. Skeleton structure is ported; existing `classNames` are preserved.

Optional migrations (multi-channel allowlist, menu webhooks) are always presented — confirm skip at runtime.

## Related Skills

This skill covers project-specific patterns. For broader knowledge:

```shell
# Universal Saleor API patterns (required dependency)
npx skills add saleor/agent-skills --skill saleor-storefront

# Generic React/Next.js best practices
npx skills add vercel-labs/agent-skills --skill react-best-practices
npx skills add vercel-labs/agent-skills --skill composition-patterns
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

## License

MIT
