# Locale & Channel URL Routing

Browse routes use **two URL prefixes**: locale (language) then channel (market). Checkout is unchanged.

> **ADR:** `docs/adr/0001-locale-channel-url-routing.md`  
> **Status:** Implemented for browse routes (`/[locale]/[channel]/…`). Middleware 308-redirects legacy `/{channel}/…`. Language picker and GraphQL `languageCode` wiring are follow-ups.  
> **Channels (markets):** `ui-channels.md` · **SEO:** `seo-metadata.md`

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
5. **Picker behavior** — swap one segment, preserve path suffix; confirm if cart channel changes.
6. **Cache** — content tag `storefront-content:{channel}:{locale}`; catalog tags stay channel/slug-scoped until translation-aware tags are added.

---

## Implementation map (when migration starts)

| Concern         | Location (planned)                                                       |
| --------------- | ------------------------------------------------------------------------ |
| Route tree      | `src/app/(storefront)/[locale]/[channel]/…`                              |
| Locale config   | `src/config/locale.ts` — extend `available`, maps to `LanguageCodeEnum`  |
| Channel guard   | move/extend current `[channel]/layout.tsx`                               |
| Links           | replace `LinkWithChannel` → locale-aware helper                          |
| Pathname helper | `useSelectedPathname` — strip `/{locale}/{channel}`                      |
| Middleware      | root redirect, optional `Accept-Language`, preference cookie             |
| GraphQL         | pass `languageCode` on public queries                                    |
| Content         | `getStorefrontContent(channel, locale)` — wire Saleor translations       |
| Picker          | header market + language UI (footer channel select retired or secondary) |
| SEO             | `hreflang`, canonical, sitemap per locale×channel                        |

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
❌ **Hardcoding `EN_US`** in new GraphQL after locale routing ships

---

## Related

- `ui-channels.md` — channel allowlist, fulfillment, channel selector (today)
- `data-storefront-content.md` — locale-keyed content cache
- `data-caching.md` — revalidation across channels
