# Storefront Content Layer

Marketing and merchandising copy (announcement bar, homepage sections, cart trust labels, checkout empty states) lives in a **provider-agnostic content layer** — separate from catalog data, menus, and transactional checkout state.

> **Companion rules**: Saleor Models → `data-storefront-content-saleor.md` · Attribute types & catalog refs → `data-storefront-content-attributes.md`  
> **Operational docs**: `config/saleor/README.md`

---

## Mental Model

```
┌─────────────────────────────────────────────────────────────────┐
│  UI (layout, homepage, cart drawer, checkout)                   │
│       ↓ reads StorefrontContent                                 │
├─────────────────────────────────────────────────────────────────┤
│  getStorefrontContent(channel, locale)   ← "use cache" (server) │
│       ↓                                                         │
│  loadStorefrontContent → ContentProvider (code | saleor)        │
│       ↓                                                         │
│  code: defaults.ts          saleor: fetch Pages → mappers       │
│       ↓                              ↓                          │
│       └──────── mergeStorefrontContent(defaults, partial) ─────┘
└─────────────────────────────────────────────────────────────────┘
```

**Code defaults always win as the base.** Saleor (or a future CMS provider) supplies **partials** that overlay defaults. The app never ships with blank copy when Saleor is down or a field is unset.

---

## Key Files

| Purpose                     | Location                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| Typed contract              | `src/lib/content/types.ts`                                            |
| Code fallback copy          | `src/lib/content/defaults.ts`                                         |
| Provider switch             | `src/lib/content/provider.ts` (`CONTENT_PROVIDER` env)                |
| Deep merge                  | `src/lib/content/merge.ts`                                            |
| Cached entry point (server) | `src/lib/content/get-storefront-content.ts`                           |
| Client-safe exports         | `src/lib/content/index.ts`                                            |
| Server-only export          | `src/lib/content/server.ts`                                           |
| Saleor fetch + mappers      | `src/lib/content/saleor/`                                             |
| Cache profile + tags        | `src/lib/cache-manifest.ts` (`storefront-content:{channel}:{locale}`) |

**Do not** import `getStorefrontContent` from the client barrel — `"use cache"` must stay server-only.

---

## Providers

| `CONTENT_PROVIDER` | Behavior                                                                  |
| ------------------ | ------------------------------------------------------------------------- |
| `code` (default)   | Returns `defaults.ts` only — no Saleor call                               |
| `saleor`           | Fetches storefront Pages, maps attributes → partial, merges over defaults |
| `url`              | Reserved; falls back to `code`                                            |

Restart `next dev` after changing `CONTENT_PROVIDER`.

---

## Merge Semantics (important)

When extending mappers or adding fields:

1. **`omitEmpty`** — skip empty strings so Saleor does not overwrite a default with `""`.
2. **`coalesceArray`** — empty arrays from Saleor do not wipe default list content (e.g. homepage paragraphs).
3. **Saleor provider** folds surface mappers with `reduce(mergeStorefrontContent, defaults)`.
4. On GraphQL failure, Saleor provider returns **full defaults** (warn in dev, error log in prod).

Exact field list lives in `types.ts` / `defaults.ts` — those evolve; merge rules stay stable.

---

## Where Content Is Consumed

| Surface                                        | Loader                                                         |
| ---------------------------------------------- | -------------------------------------------------------------- |
| Announcement bar, shared chrome                | `(main)/layout.tsx` → `MainChrome`                             |
| Homepage sections                              | `(main)/page.tsx`                                              |
| Cart trust / empty copy                        | Cart drawer (client reads props or context from server parent) |
| Checkout empty states, trust, marketing opt-in | `checkout-session-loader.tsx` → `CheckoutContentProvider`      |

Checkout resolves **channel from cart cookies** when loading content so copy can match the cart's channel.

---

## Caching & Freshness

- Profile: `storefront-content` (~menus tier, ~5 min stale).
- Tag: `storefront-content:{channel}:{locale}` (BCP 47 from `getLocaleBcp47List()`).
- **Locale** keys both the cache tag and the `"use cache"` function args. Catalog/menus/CMS use `localeSlug` in function args with slug-scoped tags — see `data-caching.md` § Locale & Caching.
- **Catalog translations** (products, categories, menus, CMS pages) are wired: GraphQL `languageCode` + `withTranslated*Fields`.
- **Storefront Models content** uses `StorefrontContentPages.graphql` `translation` on plain-text attributes via `buildAttributeMap`.
- **Invalidation goes through [saleor-paper-app](https://github.com/saleor/saleor-paper-app)** — do not point Saleor webhooks directly at the storefront for production. The app subscribes to Saleor events, then `POST`s to Paper's `/api/revalidate` with the same payload shape the storefront handler expects.
- **Storefront content:** `PAGE_*` on Pages whose slug matches `storefront-*` (e.g. `storefront-homepage`, `storefront-homepage-{channel}`) → `planStorefrontContentRevalidation()` in `cache-manifest.ts` → `revalidateTag(storefront-content:{channel}:{locale})` + homepage paths per channel.
- **Menus** (nav/footer): `MENU_*` / `MENU_ITEM_*` → separate profiles (`navigation`, `footerMenu`) — same paper-app → storefront path.
- The `storefront-content` profile is listed in `GET /api/cache-info` so the Dashboard app can offer manual purge alongside catalog entities.
- Manual (dev / emergency): `GET /api/revalidate?tag=storefront-content:{channel}:{locale}` with `REVALIDATE_SECRET`.

```
Saleor (PAGE_UPDATED on storefront-homepage)
    → saleor-paper-app (page-changed webhook)
    → POST /api/revalidate { page: { slug } }
    → planStorefrontContentRevalidation → revalidateTag + revalidatePath
```

Marketing copy is cached like navigation — cart/checkout **transactional** data stays fresh via `cache: "no-cache"`.

---

## Changing Copy (agent checklist)

**Code-only (no Saleor):**

1. Edit `defaults.ts` and/or `types.ts` if shape changes.
2. Wire new fields through the relevant page/component.

**Saleor-backed — copy only (no schema change):**

1. Edit values in Dashboard → Models.
2. Revalidate cache or wait for TTL.

**Saleor-backed — new field or PageType (commerce-as-code):**

1. Add attribute + model field in Configurator YAML (see `data-storefront-content-saleor.md`).
2. Extend `StorefrontContentPages.graphql` if new attribute types are needed → `pnpm run generate`.
3. Add slug to `attribute-slugs.ts` and a mapper in `src/lib/content/saleor/mappers/`.
4. Run `pnpm content:verify-attribute-slugs`.
5. Configurator deploy to sync schema/seed to Saleor; then set copy in Dashboard for ongoing editorial work.
6. Revalidate cache or wait for TTL.

---

## Anti-Patterns

- Importing `@/lib/content/server` from `"use client"` components.
- Putting merchandising copy in `src/config/*.ts` — use the content layer.
- Hardcoding announcement/homepage strings in UI components when `getStorefrontContent` is available upstream.
- Assuming empty Saleor attribute means "clear this field" — empty means **keep default** unless you intentionally change merge rules.
- Listing every attribute slug in this rule — read `attribute-slugs.ts` and mappers for the current contract.
