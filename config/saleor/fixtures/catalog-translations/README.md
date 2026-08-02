# Catalog translations

> [!WARNING] > **Experimental — not officially supported.** These scripts are provided as-is and may change or be removed without notice. They are not part of the supported storefront surface; use against dev/staging instances you control.

**Advanced tooling** for locale-specific copy on native Saleor catalog entities (products, categories, collections, attributes). Separate from:

| Layer                         | Tool                                                |
| ----------------------------- | --------------------------------------------------- |
| Storefront marketing (Models) | `pnpm configurator:storefront-content:translations` |
| Catalog entities              | `pnpm catalog:translations:*` (this folder)         |
| UI chrome                     | next-intl JSON                                      |

## Who is this for?

In most real shops, **translating catalog copy is a merchandiser's job**, done in the Saleor Dashboard — not something developers run from a repo. So this is intentionally niche. It exists for cases like:

- **Seeding a demo or fresh environment** with multilingual catalog copy.
- **Importing from an external translation system / TMS** — export your translations to the `locales/*.yaml` shape and push them in bulk (the create-only default means re-imports won't clobber Dashboard edits).
- **Bootstrapping** a catalog before merchandisers take over editing in the Dashboard.

If your translation workflow lives in the Dashboard or a dedicated TMS integration, you probably don't need these scripts at all.

## Safety model

- **Create-only by default** — deploy writes a field only when no translation exists yet. Existing translations (e.g. hand-edited in the Dashboard) are **left untouched** and reported as `protected`. Pass `--overwrite` to update them.
- **Idempotent** — fields already matching the fixture are classified `unchanged` and skipped, so re-runs make no redundant writes.
- **`locales/` is gitignored** — your real slugs and translations never ship in the repo.
- **`examples/` are fictional** — templates only; deploy never reads this folder.
- **Plan before write** — the run builds a full plan and aborts before any mutation if data errors (`--fail-on-skip`) are found.
- **English (`EN`) is rejected** — Saleor default language must not be overwritten via fixtures.
- **Permission checked first** — `SALEOR_CONFIGURATOR_TOKEN` (staff or app) must hold `MANAGE_TRANSLATIONS`, verified before any write.

## Workflow

### 1. Credentials

Same as Configurator — broad staff token in `.env.configurator.local` (never commit):

```env
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
SALEOR_CONFIGURATOR_TOKEN=...
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel
```

### 2. Fetch English baseline

Pulls your live catalog into a local reference file (gitignored):

```bash
pnpm catalog:translations:fetch
# → config/saleor/fixtures/catalog-translations/locales/catalog-source.json
```

Use `catalog-source.json` as the slug checklist when writing translations.

### 3. Create locale fixtures

Copy templates from `examples/` into `locales/` and replace fictional slugs with yours:

```bash
cp config/saleor/fixtures/catalog-translations/examples/example.pl.yaml \
   config/saleor/fixtures/catalog-translations/locales/pl.yaml
```

Split files merge automatically by `languageCode`:

```
locales/
  pl.yaml
  pl.attributes.yaml
  pl.product-attributes.yaml
  de.yaml
  ...
```

Fixture format:

```yaml
languageCode: PL # Saleor LanguageCodeEnum — not EN

categories:
  your-category-slug:
    name: "Translated name"
    slug: "translated-url-handle" # optional — Saleor translation.slug (ADR 0004)
    seoDescription: "Translated SEO"

collections:
  your-collection-slug:
    name: "..."
    slug: "..."
    description: "Plain text — deploy converts to EditorJS"

products:
  your-product-slug:
    name: "..."
    slug: "..."
    description: "..."
```

URL `slug` values should be lowercase ASCII with hyphens. For CJK locales, prefer romanization over native-script handles (encoding / tooling).

Attribute labels and per-product text attributes use `*.attributes.yaml` and `*.product-attributes.yaml` — see `examples/`.

### 4. Preflight (required)

```bash
pnpm catalog:translations:plan
```

Reports slug coverage against your Saleor instance. Exits with an error if any fixture slug is missing (`--fail-on-skip`). Fix mismatches before deploying.

### 5. Deploy

```bash
pnpm catalog:translations:deploy
```

Create-only: applies **new** translations, skips **unchanged**, and leaves any **differing existing** translation untouched (reported as `protected`). Uses `--fail-on-skip`, so data errors abort before any write.

To update existing translations (overwrites Dashboard/manual edits — use deliberately):

```bash
node scripts/deploy-catalog-translations.mjs --overwrite
```

To proceed despite unknown-slug data errors (not recommended):

```bash
node scripts/deploy-catalog-translations.mjs --allow-skip
```

## Commands

| Command                            | What it does                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `pnpm catalog:translations:fetch`  | Pull English baseline → `locales/catalog-source.json`                                      |
| `pnpm catalog:translations:plan`   | Dry-run + preflight (`--dry-run --fail-on-skip`) — shows new/overwrite/unchanged/protected |
| `pnpm catalog:translations:deploy` | Apply new translations only (`--fail-on-skip`); existing left intact                       |

### Flags

| Flag             | Effect                                                                                |
| ---------------- | ------------------------------------------------------------------------------------- |
| `--dry-run`      | Plan only; no writes                                                                  |
| `--fail-on-skip` | Abort before writing if any fixture entry is a data error (unknown slug, empty value) |
| `--overwrite`    | Also update existing translations that differ from the fixture                        |
| `--allow-skip`   | Don't abort on data errors                                                            |
| `--env <file>`   | Load credentials from a specific env file                                             |

## When slugs do not match

If you customized the Configurator catalog, bundled Paper slugs will not match yours. Always:

1. `pnpm catalog:translations:fetch` on **your** instance
2. Write `locales/*.yaml` keyed to **your** slugs from `catalog-source.json`
3. `pnpm catalog:translations:plan` until coverage is 100%

## Throughput & rate limiting

All requests (reads, permission probe, and writes) share one throttled client so a deploy can't stampede Saleor. It honors the same env vars as the storefront (`src/lib/graphql.ts`):

| Env var                          | Default | Effect                                 |
| -------------------------------- | ------- | -------------------------------------- |
| `SALEOR_MAX_CONCURRENT_REQUESTS` | `3`     | Max in-flight requests                 |
| `SALEOR_MIN_REQUEST_DELAY_MS`    | `200`   | Minimum spacing between request starts |
| `SALEOR_REQUEST_TIMEOUT_MS`      | `15000` | Per-request timeout (aborts + retries) |
| `NEXT_BUILD_RETRIES`             | `3`     | Retries on `429`/`5xx`/timeout         |

`429` and `5xx` responses are retried with exponential backoff, honoring `Retry-After`. On a large catalog the deploy is intentionally slow rather than aggressive — raise the limits only against an instance you control.

## Permissions

`SALEOR_CONFIGURATOR_TOKEN` must be a staff-user **or** app token with `MANAGE_TRANSLATIONS` (dev/staging only).

## Supported locales

Match `NEXT_PUBLIC_STOREFRONT_LOCALES`: `pl`, `de`, `fr`, `fi`, `nb`, `ja`, `ko`. English lives in Saleor as the default — do not add `languageCode: EN` fixtures.
