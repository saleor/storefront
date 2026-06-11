---
name: paper-migrations
description: >
  Apply chronological Paper storefront upgrades to a forked shop. Use when the user
  says upgrade Paper, apply Paper migrations, catch up with upstream caching, or
  paper-version. Reads migrations/manifest.json and paper-version.json; ports
  architecture without overwriting custom styling.
license: MIT
metadata:
  author: saleor-paper
  version: "1.0.0"
  parent: saleor-paper-storefront
---

# Paper Migrations

Chronological upgrade prompts for forks of the Saleor Paper storefront. **Rules** (`../rules/`) describe how Paper works today; **migrations** (this folder) describe how to move a fork from an older state to that target.

## When to use

- User asks to **upgrade**, **catch up**, or **apply migrations**
- Fork is behind upstream Paper on caching, PPR, or channel configuration
- User mentions `paper-version.json` or pending Paper changes

## Before any migration

1. Read [`manifest.json`](manifest.json) for ordered registry and upstream SHAs.
2. Read repo-root **`paper-version.json`** at the storefront project root.
3. Compute **pending** migrations: manifest order minus applied/skipped entries.
4. Never run a migration whose `requires` entries are not applied (skipped optional deps block dependents — confirm with user). If blocked, **skip and revisit** in a later pass — see [Manifest order](#manifest-order) below.
5. Read [`../rules/data-caching.md`](../rules/data-caching.md) for destination patterns.

## Resolution order (SHA vs detect)

1. `paper-version.json` → pending list
2. Each pending migration's `detect.md` → already applied? applicable?
3. **SHA says applied but detect says not** → trust **detect**; warn about partial/cherry-pick
4. **Detect says applied but SHA missing** → offer to record in `paper-version.json`

## Global porting rules

### Conceptual port (not blind merge)

- Achieve **architectural and behavioral parity** in the fork's files.
- Do **not** run wholesale `git merge upstream` unless the user explicitly asks.
- Cherry-pick or copy **new** lib files when the fork has no equivalent.
- Conceptually port **modified** pages/components; preserve fork renames via discovery.

### Styling boundary

| Tag                    | Agent behavior                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `architecture`         | Must port — Suspense boundaries, data layer, cache directives, env config                                         |
| `presentation-default` | Port structure (skeleton layout, Suspense placement); **preserve existing classNames** if the file already exists |
| `styling`              | **Never** auto-apply — brand tokens, spacing, colors                                                              |

Skeleton components (`PlpPageLoading`, `GallerySkeleton`, `FeaturedProductsSkeleton`) are **architecture** for loading UX; their Tailwind classes are **presentation-default**.

### Safety

- Never delete fork-specific code without user confirmation.
- Never overwrite custom styling in existing components.
- Best-effort file discovery when paths differ; search for equivalents (`getProductData`, menu fetch, checkout helpers).
- **STOP and report** if checkout/cart/payment paths are ambiguous — do not invent structure.
- paper-app cross-repo changes: document manual steps only (see `2026-06-menu-webhooks`); no automation in v1.

### Optional migrations

When `optional: true` in manifest, **always present** the migration and ask using `skipPrompt`. Record `"skipped": true` and optional `skipReason` in `paper-version.json` if user skips.

### Subsystem replacements (checkout v2)

Most migrations are **incremental architecture ports** — same pages and components, new data layer (cache tags, Suspense shells, BFF auth). **Checkout v2** (`2026-06-checkout-v2`) is a **subsystem replacement**: it replaces most of `src/checkout/`, adds route groups, and changes the runtime model (urql → RSC + server actions). Do not apply the incremental playbook to checkout.

|               | Incremental (e.g. cache-PPR)    | Subsystem (checkout v2)                            |
| ------------- | ------------------------------- | -------------------------------------------------- |
| Change shape  | Touch existing storefront files | Replace checkout tree + new `(checkout)/` routes   |
| Port strategy | Conceptual port per file        | **Adopt upstream base**, then re-apply fork deltas |
| Failure mode  | Stale cache, build errors       | Broken payments, session desync, step URL bugs     |

**Rules for subsystem migrations:**

- **One atomic migration** — do not split (e.g. `2026-06-checkout-v2` stays a single manifest entry).
- **Hard `requires`** — run dependencies first (`2026-06-account-ppr-auth` for BFF auth before checkout).
- **Default fork workflow:**
  1. **Inventory** fork deltas before touching code (payments, extra fields, analytics, metadata) — see migration's pre-migration table.
  2. **Adopt** upstream `src/checkout/`, `src/app/(checkout)/`, `src/session-bridge/`, `src/app/(checkout)/actions.ts` as the base.
  3. **Replay** customizations at **extension points** (payment registry, contact/shipping sections, server actions metadata) — not by keeping urql hooks or merging old checkout runtime.
  4. **Preserve styling** in step components (`presentation-default`).
- **STOP** if the fork must keep browser-side Saleor GraphQL for checkout — v2 does not support that model. Attempting to run urql alongside v2 is unsupported.
- **Fork-only features** (marketing opt-in, custom analytics, extra metadata) are not separate Paper migrations — implement at extension points after the base port.

Deep background: [`references/checkout-v2-overview.md`](references/checkout-v2-overview.md).

## Manifest order

`manifest.json` array order is **upstream ship chronology** (oldest first) — the reverse of the internal changelog in the caching batch doc.

| Field       | Purpose                                            |
| ----------- | -------------------------------------------------- |
| Array order | How Paper evolved; narrative for forks catching up |
| `landedAt`  | Commit timestamp metadata (informational)          |
| `requires`  | Hard execution dependencies                        |

When manifest order and `requires` conflict (e.g. menu webhooks shipped before menu data layer in git), **respect `requires` at execution time**: skip blocked migrations, continue down the list, then loop until no pending applicable migrations remain.

## Workflow

For each pending migration (in manifest order):

```
atomic/<id>/
├── MIGRATION.md   ← main prompt (read fully)
├── detect.md      ← run heuristics first
└── verify.md      ← run after porting
```

1. Read `detect.md`. If already applied → update `paper-version.json` only.
2. If optional → ask user with `skipPrompt` from manifest.
3. Read `MIGRATION.md` and execute steps — **conceptual port** for incremental migrations; **adopt-then-replay** for subsystem replacements (see above).
4. Run `verify.md` checklist + `pnpm exec tsc --noEmit`.
5. Append to `paper-version.json`:

```json
{
	"id": "2026-06-pdp-ppr-islands",
	"upstreamSha": "651f7dd0",
	"appliedAt": "2026-06-04",
	"skipped": false
}
```

Update `lastUpstreamSha` to the migration's `upstreamSha`.

## First batch

Manifest batch `2026-06-cache-ppr` (caching/PPR) plus product migrations such as `2026-06-pdp-swatch-selectors` — see [`manifest.json`](manifest.json).

Deep background: [`references/caching-overview.md`](references/caching-overview.md).

Checkout subsystem: [`references/checkout-v2-overview.md`](references/checkout-v2-overview.md) + [`atomic/2026-06-checkout-v2/`](atomic/2026-06-checkout-v2/MIGRATION.md).

## Out of scope (v1)

- Automated verify script (`pnpm paper:migrate:verify`)
- CI enforcement
- paper-app migration skill
- Auto-generation from git log
