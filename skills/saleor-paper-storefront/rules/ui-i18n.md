---
name: ui-i18n
description: Code-owned functional UI strings via next-intl (messages/{locale}.json): namespaces, ICU plurals, server vs client usage. Use when adding or translating functional UI strings (not merchant-editable copy).
---

# next-intl (code-owned UI strings)

Functional storefront strings — buttons, labels, validation, a11y, order status — live in **`messages/{locale}.json`**, not Saleor Models.

> **ADR:** `docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md`  
> **Overview:** `docs/international-storefront.md`  
> **Routing / locale segment:** `ui-locale-routing.md` (next-intl does **not** own routing)

---

## Boundary (ADR 0002)

| Bucket                       | Mechanism              | Examples                                                                     |
| ---------------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| **Code** (`messages/*.json`) | next-intl              | `Add to bag`, `Subtotal`, `Sign in`, filter labels, `sr-only` remove buttons |
| **CMS** (content layer)      | `getStorefrontContent` | Homepage hero, announcement message, cart empty state, checkout steps        |
| **Saleor catalog**           | GraphQL `languageCode` | Product names, menu labels from API                                          |

Rule of thumb: _Would a merchant reword this per shop?_ → CMS. Otherwise → messages.

---

## Locales

- **Definitions:** `src/config/locale.ts` (`LOCALE_DEFINITIONS`) — slug, BCP 47, Saleor `graphqlLanguageCode`, `htmlLang`.
- **Allowlist:** `NEXT_PUBLIC_STOREFRONT_LOCALES` (must be `NEXT_PUBLIC_*` — server and client read it).
- **Files:** one JSON per slug: `messages/en.json`, `messages/pl.json`, …
- **Types:** `src/i18n/types.d.ts` augments next-intl from `en.json` (source of truth).
- **Loader:** `src/i18n/request.ts` — dynamic import by locale filename; keep aligned with `LOCALE_DEFINITIONS`.

Built-in slugs today: `en`, `pl`, `de`, `fr`, `fi`, `nb`, `ko`.

---

## Namespaces

| Namespace         | Used for                                                       |
| ----------------- | -------------------------------------------------------------- |
| `cart`            | Drawer + page functional chrome                                |
| `productsListing` | PLP breadcrumbs (`breadcrumbHome`, `breadcrumbProducts`)       |
| `common`          | Shared (`pagination`)                                          |
| `pdp`             | PDP actions, variant a11y, badges                              |
| `plp`             | Filters, sort, quick add                                       |
| `search`          | Search page, bar (`search.bar`), sort, empty state             |
| `nav`             | Header, cart button, user menu, region picker, breadcrumb aria |
| `account`         | Auth, account nav, orders, settings, addresses                 |
| `checkout`        | Steps, summary, shipping/payment CTAs, errors, confirmation    |

Prefer **sub-namespaces** in JSON (`nav.userMenu`, `account.orderDetail`, `checkout.summary`) and narrow `useTranslations("nav.userMenu")` calls.

---

## Server Components

Pass URL locale explicitly — never rely on cookies for browse UI:

```typescript
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "search" });
	return { title: t("title"), description: t("description") };
}
```

List pages: call `getTranslations` **once** per page, pass pre-built label objects into child components (see `buildOrderRowLabels` in `order-row-labels.ts`) — avoid per-row `getTranslations` in a loop.

---

## Client Components

`"use client"` + `useTranslations`:

```typescript
import { useTranslations } from "next-intl";

export function AddToCart() {
	const t = useTranslations("pdp");
	return <button>{t("addToBag")}</button>;
}
```

Provider: `(storefront)/[locale]/layout.tsx` wraps browse with `<NextIntlClientProvider locale={localeSlug} messages={…}>`.

---

## ICU & rich text

- Plurals: `{count, plural, one {# item} other {# items}}` — use `few`/`many` for Polish.
- Interpolation: `{name}`, `{email}` — same token style as CMS `{freeShippingThreshold}`.
- Rich legal copy: `t.rich("signup.terms", { terms: (chunks) => <Link>…</Link> })`.

---

## Server actions + errors

Account mutations return `AccountActionResult` (`account-action-result.ts`):

- `{ success: false; errorKey: "passwordMinLength" }` → client translates via `resolveAccountActionError(t, result)`
- `{ success: false; error: string }` → pass-through Saleor/API message when present

Client-side validation should use the same `account.errors.*` keys before calling the action.

---

## Import boundaries

❌ Client components must **not** import barrels that pull `server-only` modules (e.g. search sort importing `@/lib/search` instead of `@/lib/search/sort-options`).

❌ Do not use next-intl middleware or `next-intl` navigation — ADR 0001 URL segment is authoritative.

---

## Adding strings

1. Add key to `messages/en.json` (correct namespace).
2. Mirror in all locale files (`pl`, `de`, `fr`, `fi`, `nb`, …).
3. Wire component with `getTranslations` / `useTranslations`.
4. Run `pnpm exec tsc --noEmit` — missing keys fail typecheck.

---

## Checkout

Checkout uses the **`checkout` namespace** for functional chrome (same ADR 0002 split as cart). Locale is passed from RSC (`loadMessagesForLocale` + `CheckoutIntlProvider`), not from a `[locale]` URL segment.

**Still CMS (`useCheckoutContent`):** `emptyCart`, `emptySession`, `marketingOptInLabel`, `trust.*`.

**Still to migrate:** server-action error fallbacks in `src/app/(checkout)/actions.ts`, `PaymentGatewayAlerts`, trust footer copy (CMS).

---

## Related

- `data-storefront-content.md` — CMS copy, policies, `{token}` formatting
- `ui-locale-routing.md` — `/{locale}/{channel}/`, region picker, cache keys
- `docs/international-storefront.md` — end-to-end guide
