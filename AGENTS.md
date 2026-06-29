# Saleor Paper — agent guide (always-on)

Paper is a Saleor headless storefront on **Next.js 16** (App Router, Server Components, Server Actions, Cache Components/PPR, BFF auth). This file is the **thin always-on router** — depth lives in bundled docs and skills, loaded on demand, not here.

## How to get context (read in this order; stop when answered)

1. **Next.js mechanics** (`use cache`, PPR, Suspense, routing, metadata, build/prerender errors) → read the **version-matched** docs bundled at `node_modules/next/dist/docs/`, and `nextjs.org/docs/messages/*` for actionable error fixes. This Next.js diverges from your training data — do not answer from memory.
2. **Paper decisions** (how _this_ repo does Saleor commerce) → read `skills/saleor-paper-storefront/SKILL.md`, then the **one** `rules/<task>.md` whose frontmatter `description` matches the task. **Never** load the compiled `skills/saleor-paper-storefront/AGENTS.md` (≈75k tokens; quarantined in `.cursorignore`).
3. **Saleor API shape** (fields, enums, nullability) → grep `src/gql/graphql.ts`, or use the `saleor-storefront` skill / `user-saleor-search` MCP. Don't restate the schema from memory.

## Precedence

Paper rules are **authoritative on architecture**: Server Components by default, Server Actions for mutations, Cache Components/PPR boundaries, BFF auth, no client-side Saleor GraphQL. Use the external Vercel skills (`vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines`) only for micro-patterns _inside_ an already-correct Paper structure. **On any conflict, Paper wins.**

## Project skill index (read `SKILL.md`, then the one matching rule)

- **Architecture:** `paper-architecture`
- **Data:** `data-caching`, `data-graphql`, `data-auth-routes`, `data-storefront-content`, `data-storefront-content-saleor`, `data-storefront-content-attributes`
- **Product:** `product-pdp`, `product-variants`, `product-filtering`
- **Checkout:** `paper-surfaces`, `checkout-design-principles`, `checkout-management`, `checkout-payment-gateways`, `checkout-components`
- **Design:** `ui-design-system`, `design-quality-rubric`, `ui-sections`, `page-composition`, `design-from-image`, `design-verification`
- **UI & channels:** `ui-components`, `ui-channels`, `ui-locale-routing`, `ui-i18n`
- **SEO:** `seo-metadata`
- **Dev:** `dev-local`, `dev-investigation`, `third-party-embeds`
- **Fork upgrades:** `skills/saleor-paper-storefront/migrations/SKILL.md` (triggers: "upgrade Paper", "apply Paper migrations")

External skills are pinned in `skills-lock.json`; run `pnpm skills:bootstrap` after clone (symlinks the project skill into `.agents/skills/` and restores external skills). Maintainers: `npx skills add …` then commit the lockfile. Full setup detail: `skills/saleor-paper-storefront/README.md`.

## Critical commands

- **`pnpm run verify`** — the single "am I done?" gate (docs drift + design-tokens + typecheck + lint + tests, fail-fast). Iterate until green before declaring done. `pnpm run verify:quick` = design-tokens + typecheck for a fast styling loop.
- `pnpm generate` / `pnpm generate:checkout` — **required** after editing `src/graphql/*.graphql` / `src/checkout/graphql/*.graphql` (`verify`/`typecheck` auto-run this via prehook).
- `pnpm run build` — only gate that catches PPR dynamic-hole regressions; run on PPR-sensitive layout changes.
- After editing `skills/.../rules/*.md`, run `pnpm run docs:compile` (or `verify` will flag the drift).
- `pnpm run doctor` — verify the agent setup is actually healthy (project skill linked, external skills installed, docs in sync, compiled doc quarantined). Run it if a session seems off; `pnpm doctor --env` also checks required env.
- A `stop` hook (`.cursor/hooks.json`) runs `lint:design-tokens` when you finish a turn and nudges you if banned color literals slipped in — fix them before declaring done. Fail-open; disable by removing the entry.
- **Opt-in workflow skills** (PPR/build & cache-tightening work): `next-dev-loop`, `next-cache-components-optimizer` — see `skills/saleor-paper-storefront/README.md` for install + preconditions. Not installed by `skills:bootstrap`.

## Non-negotiable rules

1. Run the matching `generate` after any `.graphql` change (never edit `src/gql/` or `src/checkout/graphql/generated/`).
2. Server Components by default; `"use client"` only for state, effects, event handlers, or browser APIs.
3. Style with `brand.css` tokens (`bg-background`, `text-foreground`) — never hardcoded colors.
4. Handle nullable Saleor fields intentionally — optional-chain for display, guard/throw when null is a real bug.
5. Import via the `@/` alias. The storefront must not import `@/checkout/*` — cross-surface URLs go through `@paper/session-bridge`.

## Key locations

| Purpose                                 | Path                                                                               |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| Storefront GraphQL → generated          | `src/graphql/*.graphql` → `src/gql/` (generated, do not edit)                      |
| Checkout GraphQL → generated            | `src/checkout/graphql/*.graphql` → `src/checkout/graphql/generated/` (do not edit) |
| UI components / sections / tokens       | `src/ui/components/` · `src/ui/sections/` · `src/styles/brand.css`                 |
| Cache manifest (single source of truth) | `src/lib/cache-manifest.ts`                                                        |
| SEO helpers                             | `src/lib/seo/`                                                                     |

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**Keep this block, including in commits.** It is part of the project's agent setup, maintained by `next dev` for every agent that works here. If it appears as an uncommitted change, that is intentional — commit it as-is. Do not remove it to clean up a diff; it will be regenerated.

<!-- END:nextjs-agent-rules -->
