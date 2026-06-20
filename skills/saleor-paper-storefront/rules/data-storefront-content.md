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

### Scope: editorial copy vs functional UI strings (ADR 0002)

This layer holds **editorial / merchant-editable copy only** — text a merchandiser would reword per shop (announcement bar, homepage sections, listing title/description, cart empty-state & trust signals, checkout). **Functional UI strings** (cart totals/buttons, the `{count} items` counter, `Qty:`/`Variant:` labels, breadcrumbs, `sr-only` a11y labels, PDP/PLP/search/nav/account chrome) are **code-owned via next-intl** in `messages/{locale}.json` — type-safe, reviewed in code, with ICU plurals. See `ui-i18n.md` for namespaces.

Rule of thumb: _"Would a merchant reword this per shop?"_ → content layer (CMS); otherwise → `messages/*.json`.

next-intl owns **messages, not routing** — the `[locale]` URL segment (ADR 0001) stays authoritative and is passed explicitly (`getTranslations({ locale })` in RSC; `<NextIntlClientProvider locale={…}>` in `(storefront)/[locale]/layout.tsx`). See `docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md`.

### Policy vs copy

`StorefrontContent` has a top-level **`policies`** branch (sibling to `chrome` / `surfaces`) for channel-wide _facts_ — `shipping.freeShippingThreshold`, `returns.windowDays`, etc. These are structured values (not strings): channel-scoped, locale-independent, and consumed by **logic** (cart progress math) as well as **copy**. Copy never hardcodes the number — it references it with `{freeShippingThreshold}` / `{returnsWindowDays}` tokens resolved via `buildPolicyLabelValues()` + `formatContentLabel()`. This is the single source of truth: the cart math, announcement bar, and cart trust signal can never disagree. Modeled in Saleor as the `storefront-policies` PageType (`NUMERIC`/`BOOLEAN`) — see `data-storefront-content-saleor.md`.

### Announcement bar dismissal identity

When `announcementBar.dismissible` is true, the bar stores dismissal in the visitor's `localStorage`. The key is resolved by `resolveAnnouncementDismissKey()` in `announcement-dismiss-key.ts` (client-safe export from `@/lib/content`):

| `announcementBar.id`                                         | Dismissal key                                                                                       | When to use                                                                                                                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Empty** (code default)                                     | `paper:announcement-dismissed:content:{hash}` — hash of **rendered** `message`, `href`, `linkLabel` | Default. Merchants edit copy in Dashboard; any message/link change re-shows the bar for visitors who dismissed the old version. No extra field to maintain. |
| **Non-empty** (`announcement-id` in Saleor or `defaults.ts`) | `paper:announcement-dismissed:id:{id}`                                                              | Campaign slug. Dismissal survives message tweaks until you change `id` (e.g. `summer-sale-2026` → `fall-sale-2026`).                                        |

**Important:** Pass the **interpolated** message into the resolver (after `{freeShippingThreshold}` etc.) — `(main)/layout.tsx` does this before `MainChrome`. Policy threshold changes therefore change the content hash and re-show the bar, which is usually correct.

Saleor: leave `announcement-id` unset for content-hash behavior; set it only when you need a stable campaign id across copy edits. Configurator seed may include an example id — remove it to opt into content-hash dismissal.

---

## Key Files

| Purpose                     | Location                                                              |
| --------------------------- | --------------------------------------------------------------------- |
| Typed contract              | `src/lib/content/types.ts` (incl. `StorefrontPolicies`)               |
| Code fallback copy          | `src/lib/content/defaults.ts`                                         |
| Policy token formatting     | `src/lib/content/policy-format.ts` (`buildPolicyLabelValues`)         |
| Announcement dismiss keys   | `src/lib/content/announcement-dismiss-key.ts`                         |
| Channel currency (chrome)   | `src/lib/channels/resolve-channel-currency.ts`                        |
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
