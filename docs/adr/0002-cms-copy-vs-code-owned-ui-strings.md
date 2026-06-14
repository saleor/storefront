# ADR 0002: CMS editorial copy vs code-owned UI strings (next-intl)

**Status:** Accepted
**Date:** 2026-06-14
**Deciders:** Paper storefront team
**Implementation:** Shipped (storefront surface) — `next-intl` for functional strings, Saleor Models for editorial copy. Follows ADR 0001 routing.

## Context

The storefront content layer (`src/lib/content/`) is a provider-agnostic copy system: a typed
`StorefrontContent` tree with a code default (`defaults.ts`) and an optional Saleor Models
override (`CONTENT_PROVIDER=saleor`). It was the **only** string mechanism in the app, so it
accumulated two very different kinds of text:

1. **Editorial / marketing copy** — announcement banner, homepage hero/brand-story/values,
   listing title & description, cart empty-state and trust signals, checkout opt-in. Merchants
   genuinely want to reword these per shop and per locale; they belong in a CMS.
2. **Functional / UI strings** — `Subtotal`, `Total`, `Checkout`, `Continue Shopping`, the
   `{count} items` counter, `Qty:` / `Variant:` labels, breadcrumbs (`Home` / `Products`), and
   `sr-only` accessibility labels (`Remove {product}`, `Decrease quantity`). These are part of
   the component contract — they change when the UI changes, must stay in lockstep with markup,
   and are never per-shop editorial decisions.

Funnelling category 2 through Saleor has real costs:

- **No type safety / no compile-time guarantees** — a missing key is a runtime blank, not a build error.
- **A11y risk** — an empty `sr-only` label silently degrades screen-reader output; a CMS round-trip is a fragile place for it.
- **Operational overhead** — every aria-label becomes a `PageType` attribute, a Configurator entry, a Dashboard field, and a translation row. The Cart PageType alone carried ~25 attributes, most of them buttons and totals no merchant should touch.
- **Wrong audience** — developers (not merchandisers) own this text, and they edit it in code review, not the Dashboard.

The codebase had no i18n library; the URL already carries the locale (`/{locale}/{channel}/…`,
ADR 0001) and middleware mirrors it into a `browse-locale` cookie.

## Decision

Split storefront strings by **ownership**, with two mechanisms:

| Bucket                     | Owner        | Mechanism                     | Source of truth                                                               |
| -------------------------- | ------------ | ----------------------------- | ----------------------------------------------------------------------------- |
| Editorial / marketing copy | Merchandiser | Saleor Models (content layer) | `defaults.ts` → Saleor PageType override                                      |
| Functional / UI strings    | Developer    | **next-intl** message catalog | `messages/{locale}.json` (see `LOCALE_DEFINITIONS` in `src/config/locale.ts`) |

**next-intl owns messages, not routing.** ADR 0001 already defines `[locale]` routing; we do
**not** adopt next-intl middleware or navigation. The URL locale segment stays authoritative and
is passed to next-intl explicitly:

- Server Components / metadata: `getTranslations({ locale, namespace })` with the URL `params.locale`.
- Client Components: `<NextIntlClientProvider locale={localeSlug} messages={…}>` in the storefront root layout (`(storefront)/[locale]/layout.tsx`), then `useTranslations(namespace)`.
- `src/i18n/request.ts` validates the forwarded locale against the storefront allowlist and falls back to the default — there is no cookie/URL race because callers always pass the explicit locale.

**The boundary line (conservative).** Only obviously-functional chrome moved to code; anything a
merchant might reword for brand voice stayed in the CMS:

| Moved to `messages/*.json` (code)                                                                                                    | Stayed in CMS (editorial)                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `cart.drawer`: item count, subtotal, shipping, free, calculated, total, checkout, continue shopping, remove/decrease/increase (a11y) | `cart.drawer`: title (“Your Bag”), “Add {amount} more…”, “You qualify…”                                                                 |
| `cart.page`: title, qty, variant, your total, shipping note, checkout                                                                | `cart.empty.*`, `cart.trust.*`                                                                                                          |
| `productsListing`: breadcrumb Home / Products                                                                                        | `products`: listing title & description                                                                                                 |
| `pdp`: add to bag, variant a11y, badges                                                                                              | `homepage.*` (all sections)                                                                                                             |
| `plp`: filters, sort, quick add                                                                                                      | `chrome.announcementBar`, `chrome.nav` fallback labels (`allProductsLabel`, `viewAllLabel`) — menu item names stay in Saleor (bucket 1) |
| `search`: page, bar, sort, empty state                                                                                               | `checkout.*` (all checkout functional copy — follow-up)                                                                                 |
| `nav`: header chrome, cart button, user menu, region picker, breadcrumbs                                                             |                                                                                                                                         |
| `account`: auth, account shell, orders, settings, addresses                                                                          |                                                                                                                                         |

Because all migrated strings live on storefront-only surfaces, **next-intl is wired into the
storefront surface only** — the checkout surface is untouched.

**Interpolation stays `{token}`-shaped.** next-intl uses ICU, which is a superset of the
existing `formatContentLabel` `{token}` syntax, so authors see one placeholder style across both
systems. ICU additionally gives correct plurals (e.g. Polish `one/few/many/other` for the cart
item count) that the old string templates could not express.

**Policies remain structured facts.** Channel-wide numbers (free-shipping threshold, returns
window) stay in the content layer's `policies` branch and are interpolated into _editorial_ copy
via tokens (see ADR-adjacent `data-storefront-content` rules). They are not strings and are
unaffected by this split.

## Alternatives considered

| Option                                                           | Rejected because                                                                  |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Keep everything in Saleor (status quo)                           | No type safety, a11y fragility, operational overhead for developer-owned text     |
| Hand-rolled typed TS message map (no dependency)                 | Reinvents a solved problem; no ICU plurals/formatting; more glue code to maintain |
| next-intl **with** its routing/middleware                        | Duplicates ADR 0001 routing; two sources of truth for the locale segment          |
| Aggressive boundary (also move nav, empty-states, trust, opt-in) | Removes legitimate brand-voice levers from merchants; larger regression surface   |
| Resolve next-intl locale from the `browse-locale` cookie         | Cookie can lag the URL on first navigation → wrong SSR locale for crawlers        |

## Consequences

### Positive

- **Type-safe keys** — `useTranslations`/`getTranslations` are checked against `messages/en.json` via `AppConfig["Messages"]` augmentation (`src/i18n/types.d.ts`); a missing/renamed key fails `tsc`.
- **A11y labels live in code review**, next to the markup they describe.
- **Smaller CMS surface** — Cart/Products PageTypes shed ~25 attributes; the Dashboard now shows merchandisers only text they should edit.
- **Correct plurals & formatting** via ICU, per locale.
- **No new routing concern** — locale resolution reuses the ADR 0001 URL segment.

### Negative / costs

- A second string system to learn: developers must know which bucket a string belongs to (the table above is the rule of thumb: _“would a merchant reword this per shop?”_ → CMS, else code).
- `cart.drawer` content is now split across both systems within one component (editorial fields from the `cart` prop, functional fields from `useTranslations`).
- New languages require both a `messages/{locale}.json` file and Saleor translations.
- The dynamic-import message loader in `src/i18n/request.ts` lists locales implicitly via filename; keep it aligned with `src/config/locale.ts`.

### Follow-up work

1. Extend the catalog opportunistically as new functional strings appear (default to code for chrome).
2. Consider migrating checkout-surface functional strings (currently still CMS) in a later pass if the same smells appear there.
3. **Done** — documented in `ui-i18n` skill rule and `docs/international-storefront.md`; fork routing upgrade remains `migrations/atomic/2026-06-locale-channel-routing/`.

## References

- ADR 0001: Locale and channel URL routing — `docs/adr/0001-locale-channel-url-routing.md`
- next-intl (without i18n routing): https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing
- Content layer rules: `skills/saleor-paper-storefront/rules/data-storefront-content.md`
- Saleor Models for copy: `skills/saleor-paper-storefront/rules/data-storefront-content-saleor.md`
- next-intl patterns: `skills/saleor-paper-storefront/rules/ui-i18n.md`
- Overview: `docs/international-storefront.md`
