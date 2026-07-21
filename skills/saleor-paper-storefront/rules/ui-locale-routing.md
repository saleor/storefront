---
name: ui-locale-routing
description: Locale + channel URL routing /{locale}/{channel}/…: locale config, allowlisted pairs, per-locale cache keys, region picker, GraphQL languageCode. Use when touching locale/market URLs or i18n routing.
---

# Locale & Channel URL Routing

Browse routes use **two URL prefixes**: locale (language) then channel (market). Checkout is unchanged.

> **ADR:** `docs/adr/0001-locale-channel-url-routing.md`  
> **Status:** Implemented — browse routes (`/[locale]/[channel]/…`), middleware 308 from legacy `/{channel}/…`, GraphQL `languageCode` on catalog/menus/search/CMS, region picker, per-locale cache keys. Checkout locale from cookie is a follow-up.  
> **Channels (markets):** `ui-channels.md` · **Caching:** `data-caching.md` · **SEO:** `seo-metadata.md`

---

## URL shape (target)

```
/{locale}/{channel}/{path}
```

| Segment   | Role                                                  | Examples                           |
| --------- | ----------------------------------------------------- | ---------------------------------- |
| `locale`  | Language, `html lang`, `Intl`, GraphQL `languageCode` | `en`, `pl`, `de`, `en-gb`, `en-us` |
| `channel` | Saleor channel — currency, pricing, stock, shipping   | `uk`, `us`, `pl`                   |

```
/en/uk/products/hoodie     English UI, UK market (GBP)
/en/us/products/hoodie     English UI, US market (USD)
/pl/pl/products/hoodie     Polish UI, Poland market (PLN)
```

**Checkout** (no locale/channel in path):

```
/checkout?checkout=…       channel + locale from cookies set in browse layout
```

---

## Saleor: two independent axes

| Axis     | Saleor concept                    | URL segment |
| -------- | --------------------------------- | ----------- |
| Market   | Channel                           | `{channel}` |
| Language | `LanguageCodeEnum` / translations | `{locale}`  |

Do not collapse channel into locale unless the merchant uses a fixed 1:1 market–locale map (Shopify-style) — that is a separate routing mode, not the Paper default.

When **the same language spans multiple channels** (English on `us` and `uk`), either:

- Keep channel in the path: `/en/us/…` vs `/en/uk/…`, or
- Use region in the locale slug: `/en-us/…` vs `/en-gb/…` (channel may still be present or derived from config)

Bare `/en/…` without channel is ambiguous for pricing and stock.

---

## Conventions (lock when implementing)

1. **Canonical** — always `/{locale}/{channel}/…`; 301 legacy `/{channel}/…` during migration.
2. **Locale slugs** — lowercase BCP 47; map to Saleor in `src/config/locale.ts` (`graphqlLanguageCode`, `htmlLang`, `Intl` locale).
3. **Root `/`** → `/{defaultLocale}/{defaultChannel}/`.
4. **Allowlist** — valid `(locale, channel)` pairs from config; invalid → `notFound()` or redirect.
5. **Picker behavior** — swap one segment, preserve path suffix; confirm if cart channel changes (market switch warns when cart cookie exists).
6. **Cache keys** — pass `localeSlug` into every `"use cache"` catalog/menu fetch; Next.js caches each locale separately (same TTL/speed per language).
7. **Cache tags** — catalog tags stay slug-scoped (`product:{slug}`); webhooks fan out paths via `buildPathsForAllLocales()`. Storefront content uses `storefront-content:{channel}:{locale}` (BCP 47). See `data-caching.md`.
8. **Locale×channel pairs** — optional `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS=en:uk,pl:pl`; when unset, any allowed locale × any allowed channel is valid. Must be `NEXT_PUBLIC_` — both the server (404 guard, hreflang) and the client picker/nav read it. See `src/config/locale-channel.ts`.

---

## Caching with locale

Browse performance is unchanged after locale routing — locale is part of the **cache key** (function arguments), not an extra runtime cost on warm pages.

| Layer              | Locale in key?      | Notes                                                       |
| ------------------ | ------------------- | ----------------------------------------------------------- |
| PDP / PLP / CMS    | ✅ `localeSlug` arg | Separate cached GraphQL payload per language                |
| Nav / footer menus | ✅ `localeSlug` arg | Tag `navigation:{channel}` clears all languages for channel |
| Storefront content | ✅ tag + arg        | `storefront-content:{channel}:{locale}`                     |
| Cart / checkout    | N/A                 | Always `cache: "no-cache"`                                  |

**GraphQL:** Map URL slugs to Saleor **base** language codes in `src/config/locale.ts` (`pl` → `PL`, not `PL_PL`). Merge `translation { … }` fields after fetch (`src/lib/saleor-translations.ts`).

**Translatable catalog slugs (Saleor 3.21+):** Product / category / collection / page URLs may use `translation.slug` per locale. Resolve with `slugLanguageCode` then primary fallback for **every** locale (`src/lib/catalog/resolve-by-slug.ts`); build links with `pickTranslatedSlug`; keep `entity.slug` as cache/webhook identity. Fetch all locale handles via `*LocaleSlugTranslations` aliases (`buildLocaleSlugMap`) for hreflang and zero-hop language switching. See `docs/adr/0004-translatable-slugs.md`.

**Invalidation:** Product update → `revalidateTag("product:{slug}")` → busts EN/PL/DE cached entries → `revalidatePath` for every `/{locale}/{channel}/products/{slug}`.

Full detail: `data-caching.md` § Locale & Caching.

## Implementation map (when migration starts)

| Concern         | Location (planned)                                                                        |
| --------------- | ----------------------------------------------------------------------------------------- |
| Route tree      | `src/app/(storefront)/[locale]/[channel]/…`                                               |
| Locale config   | `src/config/locale.ts` — extend `available`, maps to `LanguageCodeEnum`                   |
| Channel guard   | move/extend current `[channel]/layout.tsx`                                                |
| Links           | replace `LinkWithChannel` → locale-aware helper                                           |
| Pathname helper | `useSelectedPathname` — strip `/{locale}/{channel}`                                       |
| Middleware      | root redirect, optional `Accept-Language`, preference cookie                              |
| GraphQL         | pass `languageCode` on public queries                                                     |
| Content         | `getStorefrontContent(channel, localeSlug)` — Saleor Models plain-text translations wired |
| Picker          | header market + language UI (footer channel select retired or secondary)                  |
| SEO             | `hreflang`, canonical, sitemap per locale×channel                                         |

---

## Migration from `/{channel}/…`

| Today                              | Target                                |
| ---------------------------------- | ------------------------------------- |
| `/uk/products/foo`                 | `/en/uk/products/foo`                 |
| `LinkWithChannel` href `/products` | `/{locale}/{channel}/products`        |
| `ChannelSelect` → `/${channel}`    | swap channel segment in full pathname |
| `app/page.tsx` redirect            | `/${defaultLocale}/${defaultChannel}` |

Run **301** from old URLs for at least one release.

---

## Anti-patterns

❌ **Cookie-only locale** for browse — hurts SEO and sharing  
❌ **`?lang=pl` on channel URLs** as the primary mechanism  
❌ **Dropping channel** when multiple markets share a language  
❌ **Putting locale after channel** (`/uk/en/…`) — conflicts with this ADR  
❌ **Implementing `[locale]` routes** before ADR helpers and redirect plan exist  
❌ **Hardcoding `EN_US` / `PL_PL` in `graphqlLanguageCode`** — Dashboard translations use base codes (`EN`, `PL`); see `src/config/locale.ts`  
❌ **Omitting `localeSlug` from cached fetches** — All locales would share one cache entry and wrong language  
❌ **Overwriting `entity.slug` with the translation** — Breaks cache tags / webhooks; use `pickTranslatedSlug` for URLs only  
❌ **Assuming Saleor falls back between primary and translated slug lookups** — Client must try both (`resolveByPossiblyTranslatedSlug`)  
❌ **Keeping a translated slug when switching locale** — Foreign-language handles 404; rewrite to primary slug via `CatalogIdentityBridge`

---

## Related

- `ui-channels.md` — channel allowlist, fulfillment, channel selector (today)
- `data-storefront-content` — locale-keyed content cache
- `data-caching.md` — locale cache keys, tags, invalidation fan-out
- `ui-i18n` — next-intl namespaces and patterns
- `docs/international-storefront.md` — human overview (three string systems)
