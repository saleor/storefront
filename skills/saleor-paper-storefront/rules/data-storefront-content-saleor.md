# Storefront Content — Saleor Models

Paper models merchandising copy in **Saleor Models** (PageTypes + Pages + page-type attributes). The storefront maps those Pages into the normalized `StorefrontContent` shape defined in code.

> **Runtime behavior** (providers, merge, cache): `data-storefront-content.md`  
> **Deploy & tokens**: `config/saleor/README.md`  
> **Exact attributes** change over time — treat `src/lib/content/attribute-slugs.ts` and `config/saleor/storefront-content.config.yml` as the live contract, not this doc.

---

## Models as the content surface

**Saleor Models** (PageTypes + Pages) are the dedicated place for merchandising and editorial copy in Paper. Each **PageType** defines a purpose — chrome, homepage, cart, checkout — and the **attributes** on that type give structure to otherwise unstructured text (headings, labels, paragraphs, flags).

| Model (PageType)      | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `storefront-chrome`   | Site-wide chrome (e.g. announcement bar) |
| `storefront-homepage` | Homepage sections                        |
| `storefront-cart`     | Cart drawer copy                         |
| `storefront-checkout` | Checkout surface copy                    |

That is what modeling is for: keep flexible marketing content **structured and editable** through typed attributes, and mappable into a stable `StorefrontContent` contract in code. **Day-to-day copy changes** happen in Dashboard → Models; Configurator is for **commerce-as-code** when the Saleor schema itself needs updating (see below).

**Models are translatable in Saleor** — attribute values on a Page can be translated per language in Dashboard today. Merchandisers can enter translations now; Paper will serve them once the storefront fetch is wired (no Saleor schema change required).

Pages are **not** channel-scoped in Saleor. Per-channel copy is a **convention** — separate Page instances distinguished by slug (see below), resolved in the storefront provider.

---

## Conceptual Schema

```
PageType (e.g. storefront-homepage)
  └── assigned PAGE_TYPE attributes  (hero heading, CTA label, …)
  └── Page instances (Models in Dashboard)
        └── attribute values per page
```

**One PageType per storefront surface** (chrome, homepage, cart, checkout). Constants in `src/lib/content/constants.ts` (`STOREFRONT_PAGE_TYPES`).

Dashboard tabs are typically named **Storefront — Chrome**, **Storefront — Homepage**, etc. PageType slugs use the `storefront-` prefix.

---

## Slug Stack (global vs per-channel copy)

Saleor enforces **globally unique page slugs** — there is no native “this page belongs to channel X”. Paper simulates per-channel copy with slug naming:

| Tier                 | Page slug pattern                                                       | Purpose                       |
| -------------------- | ----------------------------------------------------------------------- | ----------------------------- |
| **Global**           | Same as PageType slug (e.g. `storefront-homepage`)                      | Default copy for all channels |
| **Channel override** | `{pageTypeSlug}-{channelSlug}` (e.g. `storefront-homepage-channel-pln`) | Per-channel copy              |

**Resolution order** (in `resolve-page.ts`):

```
1. storefront-{surface}-{channel}   ← channel override wins
2. storefront-{surface}           ← global fallback
3. defaults.ts                    ← code fallback (always present)
```

Fetch collects **both** candidate slugs per surface, then picks the best match.

**Revalidation scope:** editing the global page invalidates all channels; editing a channel-specific page invalidates that channel only (`resolveStorefrontContentChannelsForPageSlug`).

---

## Attributes: Names vs Slugs

| Layer                  | Uses                                                                       |
| ---------------------- | -------------------------------------------------------------------------- |
| **Configurator YAML**  | Human **display names** on `contentAttributes` and model `attributes` keys |
| **Saleor**             | Assigns **slugs** from names (slugify)                                     |
| **Storefront mappers** | Read by **slug** via `attribute-slugs.ts`                                  |

Configurator resolves attributes by **name** when deploying; the app reads **slugs** at runtime. Keep YAML names and `attribute-slugs.ts` in sync — run `pnpm content:verify-attribute-slugs`.

**Attribute types:** see `data-storefront-content-attributes.md` — scalar types, catalog **references** (`SINGLE_REFERENCE` / `REFERENCE`), and what Paper wires today.

---

## Configurator (commerce-as-code, not editorial)

**Saleor Configurator** syncs YAML to Saleor when the **structure** of storefront content changes — new PageTypes, new attributes, seed models, baseline values for new environments. It is **not** the day-to-day editor for merchandisers.

| Who / when                                                        | Tool                                                        |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| Merchandiser updating hero text, trust labels, translations       | **Dashboard → Models**                                      |
| Developer adding a new content field or bootstrapping dev/staging | **Configurator** (`storefront-content.config.yml` + deploy) |

Seed file: `config/saleor/storefront-content.config.yml`

```bash
pnpm configurator:storefront-content:validate   # offline schema check
pnpm configurator:storefront-content:plan       # dry-run remote diff
pnpm configurator:storefront-content:deploy     # apply (additive for omitted sections)
```

**Token split (dev safety):**

| Variable                    | File                      | Used by                           |
| --------------------------- | ------------------------- | --------------------------------- |
| `SALEOR_APP_TOKEN`          | `.env.local`              | Next.js runtime (narrow)          |
| `SALEOR_CONFIGURATOR_TOKEN` | `.env.configurator.local` | Configurator scripts only (broad) |

Never expose configurator token as `NEXT_PUBLIC_*` or import it in app code.

**Plan vs deploy:** `plan` may show spurious DELETE drift for entities not in the partial YAML. `deploy` only creates/updates what's listed — it does not wipe the catalog when sections are omitted. See `config/saleor/README.md` for details.

**After deploy:** set `CONTENT_PROVIDER=saleor`, restart dev server. Ongoing copy work stays in Dashboard — only return to Configurator when the attribute schema or seed models need to change in code.

---

## Mapper Pipeline (saleor provider)

```
collectStorefrontContentPageSlugs(channel)
  → GraphQL StorefrontContentPages (by slug list)
  → indexStorefrontPagesBySlug (skip unpublished)
  → resolveStorefrontPageForType per surface
  → mapChromePage | mapHomepagePage | mapCartPage | mapCheckoutPage
  → reduce(mergeStorefrontContent, defaults)
```

Each mapper returns a **partial** `StorefrontContent`. Mappers live under `src/lib/content/saleor/mappers/`.

When adding a new editable field:

1. Add `contentAttribute` + model default in YAML.
2. Add slug constant in `attribute-slugs.ts`.
3. Map in the appropriate surface mapper using `buildAttributeMap` / `attrText`.
4. Add to `types.ts`, `defaults.ts`, and the UI consumer.

---

## Channel Override Recipe

To override homepage copy for channel `channel-pln`:

1. Create (or deploy) a Page with slug `storefront-homepage-channel-pln` under PageType `storefront-homepage`.
2. Set attribute values on that page.
3. Request `getStorefrontContent("channel-pln", locale)` — provider resolves the channel page first.

Global page `storefront-homepage` remains the fallback for other channels.

---

## i18n

**Saleor (ready now):** Models support translations — editors can translate attribute values per language on each Page in Dashboard. The content is there when Paper asks for it.

**Paper (fetch wired):**

- `getStorefrontContent(channel, localeSlug)` and cache tags (`storefront-content:{channel}:{locale}`) key by locale.
- `StorefrontContentPages.graphql` passes `languageCode`; plain-text attributes use `translation(languageCode: …)` in `buildAttributeMap`.

---

## Cache & Revalidation (saleor-paper-app)

Storefront content is cached (`storefront-content:{channel}:{locale}`). **Freshness is owned by the Paper Saleor app**, not ad-hoc Saleor → storefront webhooks.

| Layer                | Responsibility                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Storefront**       | Define profile + tags in `cache-manifest.ts`; implement `planStorefrontContentRevalidation()`; expose `/api/revalidate` + `/api/cache-info`. |
| **saleor-paper-app** | Register Saleor webhooks on install; forward `PAGE_*` (and `MENU_*` for nav) to the configured storefront URL with `REVALIDATE_SECRET`.      |
| **Merchant**         | Edit Models in Dashboard; app receives `PAGE_UPDATED` and triggers revalidation automatically.                                               |

When a merchant saves a `storefront-*` Page, Saleor emits `PAGE_UPDATED` → paper-app `page-changed` handler → `POST /api/revalidate` with `{ page: { slug } }` → storefront resolves slug to channel(s) and purges `storefront-content` tags.

**Agent checklist when adding content fields:**

1. Storefront only — no paper-app change if slug conventions and cache profile stay the same.
2. New cache profile or tag shape — update `cache-manifest.ts` **and** ensure paper-app still forwards the right events (or add a webhook definition in `../saleor-paper-app/src/modules/revalidation/webhook-events.ts`).
3. After paper-app webhook changes — reinstall or sync webhooks from the app configuration UI.

See `data-caching.md` for the full invalidation architecture and `migrations/atomic/2026-06-menu-webhooks/` for the menu analogue.

---

## Anti-Patterns

- Mixing surfaces on one PageType — keep chrome, homepage, cart, and checkout as separate types with their own attribute sets.
- Reusing slug `default` for pages — Saleor needs unique slugs; use the PageType slug for global singletons.
- Putting **slugs** in Configurator model `attributes` keys — use **display names** (Configurator resolves to attributes).
- Duplicating attribute lists in skills/docs — grep `attribute-slugs.ts` instead.
- Expecting `plan` delete noise to match `deploy` behavior — trust the README, not the scary diff.
- Running Configurator deploy to change live copy — edit Models in Dashboard instead; Configurator is for schema and environment bootstrap.
- Pointing Saleor webhooks straight at `/api/revalidate` while the Paper app is installed — use the app's managed webhooks so merchants get logs, manual purge, and a single revalidation path.
