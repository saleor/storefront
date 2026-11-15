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
2. Restores the external skills from `skills-lock.json` with the skills CLI, a pinned devDependency. The lock names a full commit and a content hash for each skill, so every clone gets the same files (same idea as `pnpm install --frozen-lockfile`). The CLI also links them into the folder of each agent it finds on your machine, for example `.claude/skills/` for Claude Code, which does not read `.agents/skills/`

Do **not** run `npx skills add . --skill saleor-paper-storefront` here — it copies a snapshot that drifts from `skills/`.

The repo-root `AGENTS.md` is the single always-on agent file (a thin router that points at these `skills/` paths). Bootstrap is still needed for external skills and for the project skill to appear in Cursor Settings → Rules → Skills.

**Other repos** (consuming Paper as a dependency):

```shell
npx skills add <paper-repo-url> --skill saleor-paper-storefront
npx skills add saleor/agent-skills --skill saleor-storefront
```

## What's Included

31 rules across 8 categories covering the full storefront:

| Category      | Rules                                                                                                                                                                           | Topics                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Architecture  | `paper-architecture`                                                                                                                                                            | Canonical Next.js stance, pillar index, deliberate non-goals                      |
| Data Layer    | `data-caching`, `data-auth-routes`, `data-redirect-security`, `data-graphql`, `data-storefront-content`, `data-storefront-content-saleor`, `data-storefront-content-attributes` | Cache, auth, GraphQL, merchandising copy, Models, attribute types                 |
| Product Pages | `product-pdp`, `product-variants`, `product-high-cardinality`, `product-filtering`                                                                                              | PDP architecture, variant selection, high-cardinality caps/facets                 |
| Checkout      | `paper-surfaces`, `checkout-design-principles`, `checkout-management`, `checkout-payment-gateways`, `checkout-components`                                                       | Checkout v2, UX principles, lifecycle, payments, UI                               |
| UI & Channels | `ui-components`, `ui-images`, `ui-channels`, `ui-locale-routing`, `ui-i18n`                                                                                                     | Design tokens, image cost budget, multi-currency, locale URLs, next-intl messages |
| SEO           | `seo-metadata`                                                                                                                                                                  | JSON-LD, OG images, metadata                                                      |
| Development   | `dev-local`, `dev-investigation`                                                                                                                                                | Mobile/ngrok dev setup; Saleor API investigation                                  |

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
│   ├── product-high-cardinality.md
│   ├── product-filtering.md
│   ├── checkout-management.md
│   ├── checkout-payment-gateways.md
│   ├── checkout-components.md
│   ├── ui-components.md
│   ├── ui-images.md
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

**Related skills** are pinned in repo-root `skills-lock.json` and restored by `pnpm skills:bootstrap`. The compiled `AGENTS.md` is a human/offline export regenerated by `pnpm run docs:compile` (agents read `SKILL.md` + one `rules/<task>.md` instead — see `.cursorignore`).

## Optional workflow skills (opt-in, not in the shared lockfile)

These first-party **Next.js workflow skills** are heavy and task-specific, so they are **not** pinned in `skills-lock.json` and `skills:bootstrap` does **not** install them. Install them per-machine when you're doing the specific work they automate:

| Skill                             | Use it for                                                                                                                | Install                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `next-dev-loop`                   | Driving a `next dev` ↔ fix loop: browser control, console, network, React-tree inspection                                 | `npx skills add vercel/next.js --skill next-dev-loop`                   |
| `next-cache-components-optimizer` | Growing the PPR static shell / tightening `"use cache"` on a route (observe-fix-iterate; rolls back on screenshot change) | `npx skills add vercel/next.js --skill next-cache-components-optimizer` |

**Preconditions (both):**

- `agent-browser` ≥ 0.27, and a running `next dev` (the skills call `/_next/mcp` directly; or add `next-devtools-mcp` to `.mcp.json` for other clients).
- A headed browser session you open and navigate first — the skills don't drive auth/SSO; you log in, navigate to the start page, then invoke the skill.
- `cacheComponents: true` (already set in Paper's `next.config.js`) for the optimizer.

Installing one in the project adds an entry to `skills-lock.json`. Leave that change out of your commits (`git restore skills-lock.json`), or install for your user with `-g`: `pnpm doctor` and Build reject a lock entry that is not pinned to a commit.

When to reach for them: PPR/build debugging and cache-tightening tasks — the exact surfaces Paper's `data-caching` / `paper-architecture` rules describe. They're machinery for those workflows, not always-on context. **Paper's rules stay authoritative** on architecture; use these skills to execute within Paper's boundaries.

**Add or update a shared external skill** (maintainers — updates the lockfile):

```shell
# Update: re-pin every source, or only the named ones, to its current upstream commit
pnpm skills:update
pnpm skills:update saleor/agent-skills

# Add: pin a new skill to a full commit (a branch or tag can move, so doctor rejects it)
pnpm exec skills add saleor/agent-skills@<full-commit-sha> --skill saleor-core

# read what changed upstream (skills:update prints the compare links), then commit skills-lock.json
```

The pins move only when you run these, so an upstream edit or a new CLI release cannot change what agents read or break a build. `pnpm doctor` fails when an installed skill no longer matches the lock, and `.github/workflows/agent-skills.yml` restores the lock from a clean checkout on every PR that changes it, the CLI version, or the bootstrap scripts.

**After clone** (everyone):

```shell
pnpm skills:bootstrap
```

## License

MIT
