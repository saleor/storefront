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
3. Read `MIGRATION.md` and execute steps (conceptual port).
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

All migrations in manifest batch `2026-06-cache-ppr` — see [`manifest.json`](manifest.json).

Deep background: [`references/caching-overview.md`](references/caching-overview.md).

## Out of scope (v1)

- Automated verify script (`pnpm paper:migrate:verify`)
- CI enforcement
- paper-app migration skill
- Auto-generation from git log
