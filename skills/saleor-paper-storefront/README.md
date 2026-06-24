# Saleor Paper Storefront Skill

Project-specific agent skill for the Saleor Paper storefront built with Next.js 16, TypeScript, and Tailwind CSS.

> **Depends on**: [`saleor-storefront`](https://github.com/saleor/agent-skills) for universal Saleor API patterns.

## Installation

**In this repo:** edit the project skill in `skills/saleor-paper-storefront/`. That folder is the source of truth for everyone (forks, upstream, `npx skills add` consumers).

Cursor does **not** auto-discover repo-root `skills/` — it loads `.agents/skills/` and `.cursor/skills/` only ([Cursor docs](https://cursor.com/docs/context/skills)). After clone:

```shell
pnpm skills:bootstrap
```

That command:

1. Symlinks `skills/saleor-paper-storefront/` → `.agents/skills/saleor-paper-storefront` (Paper-specific; the skills CLI does not do this)
2. Runs `npx skills experimental_install` to restore external skills from `skills-lock.json` (official CLI — same idea as `npm install` from a lockfile)

Do **not** run `npx skills add . --skill saleor-paper-storefront` here — it copies a snapshot that drifts from `skills/`.

`.cursorrules` and `AGENTS.md` also point agents at `skills/` paths (always-on project rules). Bootstrap is still needed for external skills and for the project skill to appear in Cursor Settings → Rules → Skills.

**Other repos** (consuming Paper as a dependency):

```shell
npx skills add <paper-repo-url> --skill saleor-paper-storefront
npx skills add saleor/agent-skills --skill saleor-storefront
```

## What's Included

21 rules across 7 categories covering the full storefront:

| Category      | Rules                                                                                                                                                 | Topics                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Architecture  | `paper-architecture`                                                                                                                                  | Canonical Next.js stance, pillar index, deliberate non-goals      |
| Data Layer    | `data-caching`, `data-auth-routes`, `data-graphql`, `data-storefront-content`, `data-storefront-content-saleor`, `data-storefront-content-attributes` | Cache, auth, GraphQL, merchandising copy, Models, attribute types |
| Product Pages | `product-pdp`, `product-variants`, `product-filtering`                                                                                                | PDP architecture, variant selection, server/client filtering      |
| Checkout      | `paper-surfaces`, `checkout-design-principles`, `checkout-management`, `checkout-payment-gateways`, `checkout-components`                             | Checkout v2, UX principles, lifecycle, payments, UI               |
| UI & Channels | `ui-components`, `ui-channels`, `ui-locale-routing`, `ui-i18n`                                                                                        | Design tokens, multi-currency, locale URLs, next-intl messages    |
| SEO           | `seo-metadata`                                                                                                                                        | JSON-LD, OG images, metadata                                      |
| Development   | `dev-local`, `dev-investigation`                                                                                                                      | Mobile/ngrok dev setup; Saleor API investigation                  |

## Structure

```
saleor-paper-storefront/
├── SKILL.md              # Overview and quick reference (agents read this first)
├── AGENTS.md             # Full compiled document — regenerate: `node scripts/compile-agents.mjs`
├── scripts/
│   └── compile-agents.mjs
├── README.md             # This file (for humans)
├── rules/                # Individual rule files
│   ├── paper-architecture.md
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
│   ├── dev-local.md
│   └── dev-investigation.md
├── migrations/         # Fork upgrade prompts (chronological)
│   ├── SKILL.md        # Orchestrator — read when upgrading a fork
│   ├── manifest.json   # Ordered registry + upstream SHAs
│   └── atomic/         # One folder per migration
└── references/           # Supporting deep-dive documentation
    ├── code-conventions.md      # kebab-case files, PascalCase exports, @/ imports
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

This skill covers project-specific patterns. External skills are pinned in repo-root `skills-lock.json`.

**Add or update an external skill** (maintainers — updates the lockfile):

```shell
npx skills add saleor/agent-skills --skill saleor-storefront
npx skills add vercel-labs/agent-skills --skill react-best-practices
# commit skills-lock.json
```

**After clone** (everyone):

```shell
pnpm skills:bootstrap
```

## License

MIT
