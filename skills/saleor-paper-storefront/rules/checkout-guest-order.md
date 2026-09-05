---
name: checkout-guest-order
description: Guest order status page at /order/{key} — HMAC tokens, redacted Saleor-id landings, email step-up, Customer Emails /order/{{id}}, live Saleor refetch vs frozen URL. Use when touching post-pay confirmation, order lookup, or order-view tokens.
---

# Guest order status

One link. The page is a locked glass door, not a key.

Anyone who has the link can see **what was bought and what it cost**. That is the shop window: items, totals, “confirmed / on its way.” It is not a secret. Saleor already treats the order id that way.

**Addresses, email, phone, payment, tracking** stay behind the door. Those are the house keys. You only get them if we already know it is you.

We know it is you in one of these ways:

1. **You just paid in this browser** — we left a short-lived cookie. Like walking from the till to the receipt counter.
2. **You have the long receipt link we minted after pay or after you proved the email** — a signed token (`ov1.…`), not the raw Saleor id. That is a spare key we cut for this order only. It expires (14 days). An expired-but-authentic token still opens the shop window (not a 404) and asks for the email.
3. **You type the email that is on the order** — same door, we check the name on the bell. Wrong email and “no such order” sound the same, so guessing does not help.
4. **You are signed in as that customer** — you already have the house keys.

The Customer Emails “View order details” button uses `/order/{{id}}`. That is the **street address**, not a spare key. Clicking it shows the shop window and asks for the email. After that we hand you a spare key (`/order/{signed-token}`) so you are not walking around with the raw id in the URL.

**What we never do:** put card numbers on the page, put email in the URL, tell you “that order exists but the email is wrong,” or treat the Saleor id as a forever password.

**One sentence:** _The link shows the receipt stub; the address and tracking only appear after we recognize you — cookie, signed token, matching email, or a logged-in account._

## What evolves (and what does not)

The **URL is frozen**. `ov1.{payload}.{mac}` carries only `{ id, exp }` — which order, and when the spare key stops unlocking the house. Reloading the same link never means a different order.

The **page is live**. Each request loads the order from Saleor with `cache: "no-cache"` (`fetchOrderOnServer`). A refresh can show a new high-level status, tracking numbers once fulfillments exist, and current lines/totals if the Dashboard edited the order. There is no client poll — reload to see change.

**Access is what ages, not the id:**

| Clock                                        | What the same `/order/{hmac}` does                                |
| -------------------------------------------- | ----------------------------------------------------------------- |
| Token still valid (14 days from mint)        | Full receipt (address, email, tracking).                          |
| Token expired (mac still good)               | Shop window + email gate. Matching email mints a **new** `ov1.…`. |
| Post-pay cookie (`paper_order_view`, 1 hour) | Separate spare key for this browser only. Not the URL.            |
| Order gone in Saleor                         | `404`.                                                            |
| Saleor unreachable                           | `500` / lookup-unavailable — never “we didn’t find your order.”   |

Do not invent a delivery date. Show min/max days only when the shipping method has them. This page is not cancel/return and not a live tracker.

## Routes

| URL                                           | Role                                                                                                                                                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/order/{hmac}`                               | Post-pay destination. Full receipt while the token is valid. Expired-but-authentic tokens show the public stub (same as Saleor id).                                                                                                           |
| `/order/{saleorId}`                           | Customer Emails landing. Redacted + email step-up unless cookie/session already matches.                                                                                                                                                      |
| `/order/{number}`                             | Redirects to `/order/find?number=`                                                                                                                                                                                                            |
| `/order/find`                                 | Number + email. Needs `SALEOR_APP_TOKEN` with `MANAGE_ORDERS`. A missing token, a token without that permission, or any failed `orders` query is not a miss — show lookup-unavailable, not “order not found.” Only `{ edges: [] }` is a miss. |
| `/checkout/complete?order=`                   | Legacy. Redirects to `/order/{id}`.                                                                                                                                                                                                           |
| `/{locale}/{channel}/account/orders/{number}` | Signed-in history. Not the email button.                                                                                                                                                                                                      |

## Files

- Tokens / sanitize / classify: `src/lib/order-view/`
- Load + redact: `src/checkout/lib/server/load-order-view.ts`
- Lookup actions: `src/app/(checkout)/order-actions.ts`
- Pages: `src/app/(checkout)/order/[key]/page.tsx`, `order/find/page.tsx`

## Ops

- `ORDER_VIEW_SECRET` (or fallback `REVALIDATE_SECRET`) signs tokens. Required in production.
- Customer Emails Branding: `https://<storefront-origin>/order/{{id}}`. One URL. Do not add `{{token}}` to the email app.
- Shop URL in that app must be the origin, not a `/{locale}/{channel}` browse path.

## Anti-patterns

- Sending a raw `OrderFragment` (addresses, email) to the client on a public landing
- Using deprecated `orderByToken`
- Linking the confirmation email to `/account/orders/{number}` for guest checkout
- Inventing a delivery date when the method has no min/max days
- Treating `/order/{hmac}` as a frozen confirmation screenshot — the URL is stable; the Saleor order is not
