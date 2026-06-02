# Saleor Paper Storefront Skill

Project-specific agent skill for the Saleor Paper storefront built with Next.js 16, TypeScript, and Tailwind CSS.

## Installation

If working within this repo, the skill is already available in `skills/`. To install it in `.agents/skills/` for agent auto-discovery:

```shell
# Install this project skill
npx skills add . --skill saleor-paper-storefront
```

## What's Included

16 rules across 6 categories covering the full storefront:

| Category      | Rules                                                                                           | Topics                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Data Layer    | `data-caching`, `data-graphql`, `data-error-handling`, `data-auth-patterns`, `webhook-handlers` | Cache Components, PPR, GraphQL codegen, error handling, auth, webhooks |
| Product Pages | `product-pdp`, `product-variants`, `product-filtering`                                          | PDP architecture, variant selection, server/client filtering           |
| Checkout      | `checkout-management`, `checkout-cart`                                                          | Session lifecycle, cart mutations, payment transactions                |
| UI & Channels | `ui-components`, `ui-channels`                                                                  | Design tokens, multi-channel URLs, fulfillment model                   |
| SEO           | `seo-metadata`                                                                                  | JSON-LD, OG images, metadata                                           |
| Development   | `dev-investigation`, `dev-testing`, `dev-new-page`                                              | API investigation, Vitest, adding routes                               |

## Structure

```
saleor-paper-storefront/
├── SKILL.md              # Overview and quick reference (agents read this first)
├── AGENTS.md             # Full compiled document (all rules expanded)
├── README.md             # This file (for humans)
├── rules/                # Individual rule files
│   ├── data-caching.md
│   ├── data-graphql.md
│   ├── data-error-handling.md
│   ├── data-auth-patterns.md
│   ├── webhook-handlers.md
│   ├── product-pdp.md
│   ├── product-variants.md
│   ├── product-filtering.md
│   ├── checkout-management.md
│   ├── checkout-cart.md
│   ├── ui-components.md
│   ├── ui-channels.md
│   ├── seo-metadata.md
│   ├── dev-investigation.md
│   ├── dev-testing.md
│   └── dev-new-page.md
└── references/           # Supporting deep-dive documentation
    ├── saleor-domain-model.md
    ├── saleor-glossary.md
    ├── saleor-key-directories.md
    ├── variant-state-machine.md
    └── variant-utils-reference.md
```

## Related Skills

This skill covers project-specific patterns. For broader knowledge:

```shell
# Generic React/Next.js best practices
npx skills add vercel-labs/agent-skills --skill react-best-practices
npx skills add vercel-labs/agent-skills --skill composition-patterns
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```

## License

MIT
