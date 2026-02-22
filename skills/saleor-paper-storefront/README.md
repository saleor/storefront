# Saleor Paper Storefront Skill

Project-specific agent skill for the Saleor Paper storefront built with Next.js 16, TypeScript, and Tailwind CSS.

> **Depends on**: [`saleor-storefront`](https://github.com/saleor/agent-skills) for universal Saleor API patterns.

## Installation

If working within this repo, the skill is already available in `skills/`. To install it in `.agents/skills/` for agent auto-discovery:

```shell
# Install this project skill
npx skills add . --skill saleor-paper-storefront

# Install the universal Saleor skill (dependency)
npx skills add saleor/agent-skills --skill saleor-storefront
```

## What's Included

11 rules across 6 categories covering the full storefront:

| Category      | Rules                                                  | Topics                                                       |
| ------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| Data Layer    | `data-caching`, `data-graphql`                         | Cache Components, PPR, GraphQL codegen, schema types         |
| Product Pages | `product-pdp`, `product-variants`, `product-filtering` | PDP architecture, variant selection, server/client filtering |
| Checkout      | `checkout-management`, `checkout-components`           | Session lifecycle, reusable UI components                    |
| UI & Channels | `ui-components`, `ui-channels`                         | Design tokens, multi-currency                                |
| SEO           | `seo-metadata`                                         | JSON-LD, OG images, metadata                                 |
| Development   | `dev-investigation`                                    | Saleor API investigation via generated types and source      |

## Structure

```
saleor-paper-storefront/
├── SKILL.md              # Overview and quick reference (agents read this first)
├── AGENTS.md             # Full compiled document (all rules expanded)
├── README.md             # This file (for humans)
├── rules/                # Individual rule files
│   ├── data-caching.md
│   ├── data-graphql.md
│   ├── product-pdp.md
│   ├── product-variants.md
│   ├── product-filtering.md
│   ├── checkout-management.md
│   ├── checkout-components.md
│   ├── ui-components.md
│   ├── ui-channels.md
│   ├── seo-metadata.md
│   └── dev-investigation.md
└── references/           # Supporting deep-dive documentation
    ├── variant-state-machine.md
    ├── variant-utils-reference.md
    └── saleor-key-directories.md
```

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
