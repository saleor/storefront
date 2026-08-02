---
name: data-storefront-content-saleor
description: Saleor Models (PageTypes + Pages) as the storefront copy surface, slug stack for per-channel copy, Configurator commerce-as-code. Use with CONTENT_PROVIDER=saleor or when adding content PageTypes/attributes.
---

# Storefront Content — Saleor Models

Paper models merchandising copy in **Saleor Models** (PageTypes + Pages + page-type attributes) and the storefront maps those Pages into the normalized `StorefrontContent` shape. This rule is the Saleor side — provider behavior, merge, and the code/Saleor scope split are in [`data-storefront-content.md`](data-storefront-content.md); attribute types in [`data-storefront-content-attributes.md`](data-storefront-content-attributes.md).

> **Live contract:** treat `src/lib/content/attribute-slugs.ts` and `config/saleor/storefront-content.config.yml` as source of truth — exact attributes change over time, this doc doesn't list them.

## Models as the content surface

Each **PageType** defines a purpose (chrome, homepage, cart, checkout); the **attributes** on that type structure otherwise-unstructured text (headings, labels, paragraphs, flags).

| Model (PageType)                                                          | Purpose                                                                                                  |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `storefront-policies` (PageType) / `storefront-policy` (global Page slug) | Channel-wide **policy values** (free-shipping threshold, returns window) — `NUMERIC`/`BOOLEAN`, not copy |
| `storefront-chrome`                                                       | Site-wide chrome (announcement bar)                                                                      |
| `storefront-homepage`                                                     | Homepage sections                                                                                        |
| `storefront-cart`                                                         | Cart drawer **editorial** copy (title, free-shipping nudges, empty state, trust)                         |
| `storefront-checkout`                                                     | Checkout surface copy                                                                                    |

One PageType per storefront surface; constants in `src/lib/content/constants.ts` (`STOREFRONT_PAGE_TYPES`). Dashboard tabs are typically **Storefront — Chrome / Homepage / …**; slugs use the `storefront-` prefix.

**Editorial-only (ADR 0002):** these models hold merchant-editable copy. Functional UI strings are code-owned via next-intl — see the scope rule in `data-storefront-content.md` and `ui-i18n.md`. When adding an attribute, ask _"would a merchant reword this per shop?"_ — if not, it belongs in `messages/*.json`.

**Policy vs copy:** `storefront-policy` holds the _facts_ (number/boolean); the other models hold _copy_ that references those facts via `{freeShippingThreshold}` / `{returnsWindowDays}` placeholders. One threshold feeds the cart math, the announcement bar, and the cart trust signal — change it once. Override per channel with `storefront-policy-{channelSlug}` (numbers in the channel currency).

**Day-to-day copy changes** happen in Dashboard → Models; **Configurator** is commerce-as-code for when the Saleor schema itself needs updating (below). Models are translatable in Saleor — editors can translate attribute values per language today; Paper serves them once the storefront fetch is wired (no schema change). Pages are **not** channel-scoped in Saleor — per-channel copy is a **convention** via slug (below), resolved in the storefront provider.

```
PageType (storefront-homepage)
  └── assigned PAGE_TYPE attributes  (hero heading, CTA label, …)
  └── Page instances (Models in Dashboard)
        └── attribute values per page
```

## Slug stack (global vs per-channel copy)

Saleor enforces **globally unique page slugs** — there's no native "this page belongs to channel X." Paper simulates per-channel copy with slug naming:

| Tier                 | Page slug pattern                                                  | Purpose                       |
| -------------------- | ------------------------------------------------------------------ | ----------------------------- |
| **Global**           | Same as PageType slug (`storefront-homepage`)                      | Default copy for all channels |
| **Channel override** | `{pageTypeSlug}-{channelSlug}` (`storefront-homepage-channel-pln`) | Per-channel copy              |

Resolution (`resolve-page.ts`): `storefront-{surface}-{channel}` (override wins) → `storefront-{surface}` (global) → `defaults.ts` (code fallback). The fetch collects **both** candidate slugs per surface, then picks the best match. Editing the global page invalidates all channels; a channel-specific page invalidates that channel only (`resolveStorefrontContentChannelsForPageSlug`).

## Attributes: names vs slugs

| Layer                  | Uses                                                                       |
| ---------------------- | -------------------------------------------------------------------------- |
| **Configurator YAML**  | Human **display names** on `contentAttributes` and model `attributes` keys |
| **Saleor**             | Assigns **slugs** from names (slugify)                                     |
| **Storefront mappers** | Read by **slug** via `attribute-slugs.ts`                                  |

Configurator resolves by **name** when deploying; the app reads **slugs** at runtime. Keep YAML names and `attribute-slugs.ts` in sync — `pnpm content:verify-attribute-slugs`. Types and catalog references (`SINGLE_REFERENCE`/`REFERENCE`) are in `data-storefront-content-attributes.md`.

**Greenfield bootstrap:** with no storefront models yet, `pnpm configurator:storefront-content:deploy` creates PageTypes, attributes, and seed models from `storefront-content.config.yml`. Copy fields that reference channel policies use `{freeShippingThreshold}` / `{returnsWindowDays}` in seed values — keep those tokens in Dashboard translations too.

## Configurator (commerce-as-code, not editorial)

Saleor Configurator syncs YAML to Saleor when the **structure** of storefront content changes — new PageTypes, attributes, seed models, baseline values for new environments. It is **not** the day-to-day editor.

| Who / when                                                    | Tool                                                        |
| ------------------------------------------------------------- | ----------------------------------------------------------- |
| Merchandiser updating hero text, trust labels, translations   | **Dashboard → Models**                                      |
| Developer adding a content field or bootstrapping dev/staging | **Configurator** (`storefront-content.config.yml` + deploy) |

Seed file: `config/saleor/storefront-content.config.yml`.

```bash
pnpm configurator:storefront-content:validate   # offline schema check
pnpm configurator:storefront-content:plan       # dry-run remote diff (may show spurious DELETE noise)
pnpm configurator:storefront-content:deploy     # apply — additive for omitted sections, never wipes
```

**Token split (dev safety):** `SALEOR_APP_TOKEN` (`.env.local`, narrow — Next.js runtime) vs `SALEOR_CONFIGURATOR_TOKEN` (`.env.configurator.local`, broad — Configurator scripts only). Never expose the configurator token as `NEXT_PUBLIC_*` or import it in app code. After deploy, set `CONTENT_PROVIDER=saleor` and restart dev; ongoing copy work stays in Dashboard. See `config/saleor/README.md`.

## Mapper pipeline (saleor provider)

```
collectStorefrontContentPageSlugs(channel)
  → GraphQL StorefrontContentPages (by slug list) → indexStorefrontPagesBySlug (skip unpublished)
  → resolveStorefrontPageForType per surface → mapChromePage | mapHomepagePage | mapCartPage | mapCheckoutPage
  → reduce(mergeStorefrontContent, defaults)
```

Each mapper returns a **partial** `StorefrontContent` (under `src/lib/content/saleor/mappers/`). Adding an editable field: (1) `contentAttribute` + model default in YAML → (2) slug constant in `attribute-slugs.ts` → (3) map in the surface mapper via `buildAttributeMap` / `attrText` → (4) add to `types.ts`, `defaults.ts`, and the UI consumer.

**Channel override recipe:** create (or deploy) a Page with slug `storefront-homepage-channel-pln` under PageType `storefront-homepage`, set its attribute values, and `getStorefrontContent("channel-pln", locale)` resolves it first; `storefront-homepage` stays the fallback for other channels.

## i18n

- `getStorefrontContent(channel, localeSlug)` and the `storefront-content:{channel}:{locale}` cache tag key by locale; `StorefrontContentPages.graphql` passes `languageCode`, and plain-text attributes use `translation(languageCode: …)` in `buildAttributeMap`.
- **Policy placeholders in translations:** localized strings must keep the same `{freeShippingThreshold}` / `{returnsWindowDays}` tokens as the default language — never bake channel-specific amounts/currencies into Dashboard translations (e.g. `"$75"`, `"30 dni"`). Paper formats money from `policies` + channel currency at render; missing placeholders warn in dev via `formatPolicyAwareLabel`.

## Cache & revalidation

Storefront content is cached under `storefront-content:{channel}:{locale}` and freshness is owned by the **saleor-paper-app**, not ad-hoc Saleor → storefront webhooks. When a merchant saves a `storefront-*` Page, Saleor emits `PAGE_UPDATED` → the app's `page-changed` handler → `POST /api/revalidate` → `planStorefrontContentRevalidation()` resolves the slug to channel(s) and purges the tags. Full invalidation architecture: `data-caching.md`.

**Agent checklist when adding content fields:** storefront-only if slug conventions and the cache profile stay the same; a new cache profile or tag shape means update `cache-manifest.ts` **and** ensure the app still forwards the right events (or add a webhook definition in `../saleor-paper-app/…/webhook-events.ts`); after app webhook changes, reinstall/sync from the app config UI. Don't point Saleor webhooks straight at `/api/revalidate` while the app is installed — use its managed webhooks so merchants get logs and a single revalidation path.

## Anti-patterns

- Mixing surfaces on one PageType — keep chrome/homepage/cart/checkout as separate types with their own attribute sets.
- Reusing the slug `default` for pages — Saleor needs unique slugs; use the PageType slug for global singletons.
- Putting **slugs** in Configurator model `attributes` keys — use **display names** (Configurator resolves to attributes).
- Duplicating attribute lists in docs — grep `attribute-slugs.ts` instead.
- Running Configurator `deploy` to change live copy — edit Models in Dashboard; Configurator is for schema/bootstrap.
