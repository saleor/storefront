# Storefront content — Saleor Configurator

Deploys **Storefront — \*** model types, content attributes, and seed models for Paper's `CONTENT_PROVIDER=saleor` layer.

## Copy ownership (source of truth)

| Layer                      | English                                             | Other locales                                   | Ongoing edits                                     |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------- |
| **Runtime**                | `src/lib/content/defaults.ts`                       | Saleor Model translations                       | Dashboard → Models when `CONTENT_PROVIDER=saleor` |
| **Configurator bootstrap** | `models:` in YAML — **exported from `defaults.ts`** | `fixtures/translations/*.yaml` (demo seed only) | Export + deploy on greenfield or schema changes   |

**YAML is a deploy vehicle, not the editorial system.** Configurator needs YAML to create PageTypes and seed Pages; merchants edit copy in Dashboard once bootstrapped.

### Changing English copy

1. Edit `src/lib/content/defaults.ts` (and `src/lib/content/types.ts` when the shape changes).
2. Export Configurator seed: `pnpm content:export-seed` (runs verify automatically)
3. Verify (CI / `pnpm test:run`): `pnpm content:verify-seed`
4. Deploy when bootstrapping Saleor: `pnpm configurator:storefront-content:deploy`

Do **not** hand-edit English strings under `models:` in `storefront-content.config.yml` — `content:verify-seed` fails on drift.

Schema sections (`contentAttributes`, `modelTypes`) stay hand-edited in YAML when adding new attributes or PageTypes.

## Safe token setup (dev)

Use **two tokens**, in **two files**:

| File                      | Purpose                                                | Loaded by                          |
| ------------------------- | ------------------------------------------------------ | ---------------------------------- |
| `.env.local`              | Storefront runtime (`SALEOR_APP_TOKEN`, narrow)        | `next dev` / `next build`          |
| `.env.configurator.local` | Configurator only (`SALEOR_CONFIGURATOR_TOKEN`, broad) | `pnpm configurator:*` scripts only |

```bash
cp .env.configurator.local.example .env.configurator.local
# Edit .env.configurator.local — paste dev/staging staff token
```

**Rules**

1. **Dev/staging Saleor only** — never point a broad token at production.
2. **Dedicated dev staff user** — e.g. `configurator-dev@yourshop.dev`, not your personal admin on prod.
3. **Never `NEXT_PUBLIC_`** — configurator token must stay server-side / CLI-only.
4. **Never import in app code** — `SALEOR_CONFIGURATOR_TOKEN` is not used by the Next.js app; only `scripts/configurator-storefront-content.sh`.
5. **Keep `SALEOR_APP_TOKEN` narrow** — channels list, webhooks, etc.; read-only where possible.
6. **Rotate** — revoke when someone leaves or after accidental exposure.

Both files match `.env*.local` in `.gitignore` — they are never committed.

### Token permissions (Configurator)

Configurator introspects the whole shop before deploy. The token needs at least:

- `MANAGE_PAGES`, `MANAGE_PAGE_TYPES_AND_ATTRIBUTES`
- `MANAGE_SETTINGS`, `MANAGE_PRODUCTS`, `MANAGE_ORDERS`, `MANAGE_SHIPPING` (remote diff)

A narrow storefront app token is usually **not** sufficient.

## Prerequisites

1. **Saleor 3.22+** (assigned page attributes) — Configurator targets **3.23.x** schema.
2. **`NEXT_PUBLIC_SALEOR_API_URL`** in `.env.local` (same as storefront).
3. **`SALEOR_CONFIGURATOR_TOKEN`** in `.env.configurator.local`.

## Commands

```bash
# Schema check (offline, no token)
pnpm configurator:storefront-content:validate

# Preview remote changes (dry-run)
pnpm configurator:storefront-content:plan

# Apply to Saleor (blocked if remote entities would be deleted)
pnpm configurator:storefront-content:deploy

# Drop all storefront-* Pages + PageTypes, redeploy schema/seed, push locale translations
pnpm configurator:storefront-content:reset
# Note: reset runs deploy twice — Configurator needs page types committed before models on greenfield.

# Push translation fixtures only (after deploy — demo/bootstrap locales)
pnpm configurator:storefront-content:translations

# Verify EN seed models match defaults.ts (also in pnpm test:run)
pnpm content:verify-seed

# Regenerate models: section from defaults.ts
pnpm content:export-seed
```

### Translation fixtures (bootstrap only)

Configurator seeds **English** attribute values via the exported `models:` block (from `defaults.ts`). Non-default locales live in separate YAML files used **once** to populate a fresh Saleor instance:

```
config/saleor/fixtures/translations/
  pl.yaml   # languageCode: PL
  de.yaml
  fr.yaml
  fi.yaml
  nb.yaml   # Norwegian Bokmål — Saleor enum NB
```

Each file maps `page slug → attribute slug → translated plain text`. Policy placeholders (`{freeShippingThreshold}`, `{returnsWindowDays}`, `{amount}`, `{label}`) must be preserved. Apply with `pnpm configurator:storefront-content:translations` (GraphQL `attributeValueTranslate` — not supported by Configurator itself).

After bootstrap, locale copy is maintained in **Dashboard → Models**, not in these YAML files.

### Catalog translations (products, categories, collections)

> **Experimental — not officially supported.** May change or be removed. Typically a merchandiser/Dashboard or TMS-export concern, not a developer workflow.

**Advanced, opt-in tooling** for translating native Saleor catalog copy. Real fixture files are **gitignored** (`fixtures/catalog-translations/locales/`); only fictional templates ship in `examples/`.

See [`fixtures/catalog-translations/README.md`](fixtures/catalog-translations/README.md):

```bash
pnpm catalog:translations:fetch   # pull English baseline from your Saleor (local, gitignored)
pnpm catalog:translations:plan    # preflight — fails on slug mismatch
pnpm catalog:translations:deploy  # push locales/*.yaml (after plan passes)
```

Requires `SALEOR_CONFIGURATOR_TOKEN` in `.env.configurator.local` — same rules as Configurator above.

## How Configurator actually behaves (from `../configurator` source)

**Diff vs deploy are not the same.**

| Layer                 | Omitted section in YAML (e.g. no `products:`)                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`diff` / `plan`**   | Treated as empty `[]` → remote entities show as **DELETE** (drift). Our partial file plans ~139 deletes.                                                                  |
| **`deploy` pipeline** | Stage no-ops when that section is missing/empty. **Channels, products, menus, etc. are not removed.** Deploy only bootstraps entities listed in the YAML (create/update). |

So the scary delete list in `plan` does **not** mean deploy will wipe the catalog. `deploy` even notes that items “marked for deletion may not have been removed”. Entity-level delete (drop a channel/product) is not implemented in the deploy stages.

`pnpm configurator:storefront-content:deploy` still uses `--failOnDelete` because the diff noise is alarming and easy to misread — not because deploy would execute those deletes.

### Option A — Additive deploy (dev, smallest diff)

Use `storefront-content.config.yml` as-is. Preview creates, then deploy **without** expecting real deletions:

```bash
pnpm configurator:storefront-content:plan   # ~47 creates + noisy delete drift
# To apply in dev, temporarily remove --failOnDelete from scripts/configurator-storefront-content.sh
# or run deploy directly with your token — only contentAttributes, modelTypes, models run.
```

Safe for catalog/channels because those stages see an empty/missing config section and return early.

**Caveats:** menus/shipping zones **in the YAML** can still be destructive on update (menus are recreated item-by-item). Omitted sections avoid that.

### Option B — Full baseline + merge (shop-as-code, CI-friendly)

Recommended when you want `diff` to mean “safe to merge” and `--failOnDelete` to be meaningful.

```bash
# 1. Download current remote state (large; exclude products if you only need structure)
pnpm dlx @saleor/configurator introspect \
  --config config/saleor/shop-baseline.config.yml \
  --url "$NEXT_PUBLIC_SALEOR_API_URL" \
  --token "$SALEOR_CONFIGURATOR_TOKEN" \
  --exclude products

# 2. Merge into baseline (do not replace wholesale):
#    - Union contentAttributes from storefront-content.config.yml
#    - Append storefront modelTypes + models
#    - Keep existing modelTypes/models (Brand, Refund Reason, …) from introspect

# 3. Preview — expect ~47 creates, 0 deletes, maybe minor updates (normalization)
pnpm dlx @saleor/configurator diff \
  --config config/saleor/shop-baseline.config.yml \
  --url "$NEXT_PUBLIC_SALEOR_API_URL" \
  --token "$SALEOR_CONFIGURATOR_TOKEN" \
  --failOnDelete

# 4. Deploy baseline; second deploy should be idempotent (0 changes)
pnpm dlx @saleor/configurator deploy \
  --config config/saleor/shop-baseline.config.yml \
  --url "$NEXT_PUBLIC_SALEOR_API_URL" \
  --token "$SALEOR_CONFIGURATOR_TOKEN" \
  --failOnDelete
```

**Merge rules**

- Never drop introspected sections you still need in Saleor.
- Never replace the whole `models:` block — **append** `storefront-*` models alongside `about`, `cozynest`, etc.
- Deduplicate `contentAttributes` by name.
- Commit `shop-baseline.config.yml` (or gitignore if too large / env-specific).

**When `--failOnDelete` should pass:** after a full introspect merge, deletes mean you intentionally removed something from the baseline — review each one. For CI, that is the guardrail you want.

### Option C — Manual Dashboard

Fastest one-off: create the four **Storefront — \*** types/models by hand, then `CONTENT_PROVIDER=saleor`.

## After deploy

1. Dashboard → **Models** → tabs **Storefront — Chrome / Homepage / Cart / Checkout**.
2. Set `CONTENT_PROVIDER=saleor` in `.env.local`.
3. Restart the dev server.

Attribute slugs are defined in `src/lib/content/attribute-slugs.ts` and must stay in sync with `storefront-content.config.yml`.

Verify locally (and optionally against Saleor):

```bash
pnpm content:verify-attribute-slugs
pnpm content:verify-seed
```

### Supported Saleor attribute types (storefront GraphQL)

The storefront fragment currently reads:

| `inputType`                       | Supported                                              |
| --------------------------------- | ------------------------------------------------------ |
| `PLAIN_TEXT`                      | Yes                                                    |
| `BOOLEAN`                         | Yes                                                    |
| `SINGLE_REFERENCE` + `COLLECTION` | Yes (`Featured collection` on homepage)                |
| Other types                       | See `skills/.../data-storefront-content-attributes.md` |

### Cache after Dashboard edits

Storefront copy is cached (`storefront-content:{channel}:{locale}`, ~5 min stale). Options:

1. **Webhook** — `PAGE_UPDATED` → `/api/revalidate` (wired for `storefront-*` slugs).
2. **Manual** — `curl -H "Authorization: Bearer $REVALIDATE_SECRET" "http://localhost:3000/api/revalidate?tag=storefront-content:default-channel:en-US"`
3. **Wait** — menus-tier revalidate window.

Restart `next dev` after changing `CONTENT_PROVIDER`.

### Cart trust copy (UX)

Cart drawer trust labels render only when the cart has line items — empty cart shows the empty state instead.

## Channel overrides

Optional per-channel copy: duplicate a model with slug `storefront-homepage-{channelSlug}` (e.g. `storefront-homepage-channel-pln`).
