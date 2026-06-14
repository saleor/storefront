# International storefront

How Paper serves **multiple languages and markets** from one deployment. Start here before adding a locale, wiring copy, or debugging “wrong language” bugs.

**ADRs:** [0001 Locale + channel routing](./adr/0001-locale-channel-url-routing.md) · [0002 CMS vs code-owned strings](./adr/0002-cms-copy-vs-code-owned-ui-strings.md)

**Skills:** [`ui-locale-routing`](../skills/saleor-paper-storefront/rules/ui-locale-routing.md) · [`ui-i18n`](../skills/saleor-paper-storefront/rules/ui-i18n.md) · [`data-storefront-content`](../skills/saleor-paper-storefront/rules/data-storefront-content.md)

---

## Three string systems (do not mix them up)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  URL: /{locale}/{channel}/products/hoodie                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Saleor catalog translations (GraphQL languageCode)                    │
│     Product names, attributes, menus, categories                        │
│     → pickTranslatedName(), translation { } fields                      │
│                                                                         │
│  2. Storefront content layer (CMS / Saleor Models)                      │
│     Editorial copy merchants reword per shop                            │
│     → getStorefrontContent(channel, localeSlug)                         │
│     → announcement bar, homepage sections, cart trust, checkout copy   │
│                                                                         │
│  3. next-intl messages (code-owned functional UI)                       │
│     Buttons, labels, a11y, validation, order status chrome              │
│     → messages/{locale}.json + useTranslations / getTranslations      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Decision rule (ADR 0002):** _Would a merchant reword this per shop for brand voice?_ → CMS (2). Otherwise → `messages/*.json` (3). Product/category **names** always come from Saleor (1).

**Channel policies** (`freeShippingThreshold`, `returnsWindowDays`) are structured **facts** in the content layer—not strings in any of the three buckets. Copy references them via `{freeShippingThreshold}` tokens.

---

## URL model

Browse: `/{locale}/{channel}/{path}`

| Segment   | Role                                      | Examples                           |
| --------- | ----------------------------------------- | ---------------------------------- |
| `locale`  | Language, `html lang`, Intl, GraphQL lang | `en`, `pl`, `de`, `fr`, `fi`, `nb` |
| `channel` | Saleor market — currency, stock, shipping | `us`, `uk`, `pl`                   |

```
/en/us/products/hoodie     English UI, US market (USD)
/fr/fr/products/hoodie     French UI, France market (EUR)
/en/uk/products/hoodie     English UI, UK market (GBP) — same language, different channel
```

Checkout stays at `/checkout` — locale and channel sync from browse via cookies (see ADR 0001).

**Region picker** (header): swap language or market; preserve path suffix. Optional `NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS` restricts valid pairs.

Legacy `/{channel}/…` URLs **308** to `/{defaultLocale}/{channel}/…` via middleware.

---

## Supported locales (code)

Defined in `src/config/locale.ts` (`LOCALE_DEFINITIONS`):

| Slug | Saleor `LanguageCodeEnum` | Notes                        |
| ---- | ------------------------- | ---------------------------- |
| `en` | `EN`                      | Default                      |
| `pl` | `PL`                      |                              |
| `de` | `DE`                      |                              |
| `fr` | `FR`                      |                              |
| `fi` | `FI`                      |                              |
| `nb` | `NB`                      | Bokmål — slug `nb`, not `no` |

Enable a subset per deployment with `NEXT_PUBLIC_STOREFRONT_LOCALES` (comma-separated). Each enabled locale needs `messages/{slug}.json`.

**Saleor Dashboard** stores translations under **base** language codes (`/translations/PL/…`), not regional variants like `PL_PL`.

---

## next-intl namespaces (storefront surface)

| Namespace         | Surfaces                                                   |
| ----------------- | ---------------------------------------------------------- |
| `cart`            | Cart drawer + cart page functional chrome                  |
| `productsListing` | PLP breadcrumbs                                            |
| `common`          | Shared UI (`pagination`, etc.)                             |
| `pdp`             | Add to bag, variant labels, badges                         |
| `plp`             | Filters, sort, quick add                                   |
| `search`          | Search page, bar, sort, empty state                        |
| `nav`             | Header, cart button, user menu, region picker, breadcrumbs |
| `account`         | Login, signup, account shell, orders, settings, addresses  |

**Patterns:** Server `getTranslations({ locale, namespace })` with URL `params.locale`. Client `useTranslations("namespace")` under `NextIntlClientProvider` in `(storefront)/[locale]/layout.tsx`. Types from `messages/en.json` via `src/i18n/types.d.ts`.

**Checkout** functional UI is still CMS-owned (`checkout.*` in storefront content). See ADR 0002 follow-up.

---

## Environment variables

```env
# Locales (must match LOCALE_DEFINITIONS + messages/*.json)
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_STOREFRONT_LOCALES=en,pl,de,fr,fi,nb

# Optional: restrict which locale can pair with which channel
# NEXT_PUBLIC_STOREFRONT_LOCALE_CHANNELS=en:uk,pl:pl

# Channels (markets) — unchanged from multi-channel docs
STOREFRONT_CHANNELS=us,uk,pl
NEXT_PUBLIC_DEFAULT_CHANNEL=us

# Merchant copy provider
CONTENT_PROVIDER=code          # defaults only
# CONTENT_PROVIDER=saleor      # Saleor Models + Configurator
```

Configurator ops: [`config/saleor/README.md`](../config/saleor/README.md).

---

## Caching & SEO

- **Cache keys** include `localeSlug` — separate cached GraphQL payload per language, same TTL.
- **Cache tags** stay slug-scoped (`product:{slug}`); webhooks fan out paths across locales via `buildPathsForAllLocales()`.
- **Storefront content** tag: `storefront-content:{channel}:{locale}` (BCP 47).
- **Canonical + hreflang** on browse pages — `buildBrowsePageMetadata()`.
- **`<html lang>`** set server-side from URL locale.

Details: [`data-caching.md`](../skills/saleor-paper-storefront/rules/data-caching.md) § Locale · [`seo-metadata.md`](../skills/saleor-paper-storefront/rules/seo-metadata.md).

---

## Add a new language (checklist)

1. **`src/config/locale.ts`** — add slug to `LOCALE_DEFINITIONS` (bcp47, graphqlLanguageCode, htmlLang).
2. **`messages/{slug}.json`** — copy structure from `en.json`; translate all keys.
3. **`NEXT_PUBLIC_STOREFRONT_LOCALES`** — include the new slug.
4. **Saleor Dashboard** — translate products, categories, menus, attributes for that language.
5. **If `CONTENT_PROVIDER=saleor`:** add `config/saleor/fixtures/translations/{slug}.yaml` and run `pnpm configurator:storefront-content:translations`.
6. **Verify:** browse URL, product name translation, cart/checkout handoff, hreflang alternates, region picker.

---

## Backlog (known gaps)

| Item                                 | Notes                                          |
| ------------------------------------ | ---------------------------------------------- |
| Checkout functional UI → next-intl   | Deferred; still `checkout.*` in CMS            |
| `not-found` / global error pages     | English                                        |
| PLP price filter labels              | Hardcoded USD ranges                           |
| GraphQL error `message` pass-through | Some account/auth API errors stay API language |

---

## Related docs

| Topic                         | Location                                                       |
| ----------------------------- | -------------------------------------------------------------- |
| Fork upgrade (locale routing) | `skills/.../migrations/atomic/2026-06-locale-channel-routing/` |
| Saleor Models + fixtures      | `config/saleor/README.md`                                      |
| Architecture pillars          | `skills/.../rules/paper-architecture.md`                       |
