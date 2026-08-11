# Paper production checklist

Linear path from a greenfield Saleor instance to a production Paper storefront.
The Dashboard **Store Readiness** guide links here for the storefront track.

## 1. Deploy Paper

1. One-click: [Deploy on Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsaleor%2Fstorefront&env=NEXT_PUBLIC_SALEOR_API_URL%2CNEXT_PUBLIC_DEFAULT_CHANNEL%2CNEXT_PUBLIC_DEFAULT_LOCALE%2CNEXT_PUBLIC_STOREFRONT_LOCALES&project-name=my-saleor-storefront&repository-name=my-saleor-storefront)
2. Or clone: `git clone https://github.com/saleor/storefront.git`
3. Optional local: `pnpm install` → copy `.env.example` → `pnpm dev`

Paper uses Saleor Models for marketing copy by default (`CONTENT_PROVIDER` defaults to `saleor`). Set `CONTENT_PROVIDER=code` only if you want code defaults without Models.

## 2. Point at your Saleor API

Set at least:

| Variable                         | Example                                       | Notes                                        |
| -------------------------------- | --------------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SALEOR_API_URL`     | `https://your-instance.saleor.cloud/graphql/` | Must end with `/graphql/`                    |
| `NEXT_PUBLIC_DEFAULT_CHANNEL`    | `default-channel`                             | Same channel you finished in Store Readiness |
| `NEXT_PUBLIC_DEFAULT_LOCALE`     | `en`                                          |                                              |
| `NEXT_PUBLIC_STOREFRONT_LOCALES` | `en` or `en,pl,de`                            |                                              |

Multi-channel storefronts: also set `STOREFRONT_CHANNELS` (see README).

## 3. Payments

Configure payment apps in the **Saleor Dashboard** (Stripe, Dummy Payment for tests).
Secrets stay in the Dashboard / payment apps — not in the storefront env.

## 4. Production cache / webhooks

Pick one:

- **Saleor Cloud:** install the [Paper app](https://github.com/saleor/saleor-paper-app) for catalog/content revalidation and preview.
- **Self-hosted:** wire Saleor webhooks to Paper’s `/api/revalidate` and set `SALEOR_WEBHOOK_SECRET` / `REVALIDATE_SECRET`.

See README § Instant Updates with Webhooks.

## 5. Storefront copy in Saleor (CMS)

1. In the **Paper app** init screen, leave **Add storefront Models** checked (or Skip if you already customized / use code-only content).
2. Edit copy in Dashboard → Models: homepage, chrome, cart, checkout, policies, products.

Advanced/dev: Configurator CLI still works — see [`config/saleor/README.md`](../config/saleor/README.md). Required vs optional Models: [`cms-boilerplate-audit.md`](./cms-boilerplate-audit.md).

**Ownership (ADR 0002):** editorial / marketing copy → Saleor Models; functional UI chrome → `next-intl` in the codebase.

## 6. Origins and go-live

- Allow your storefront origin(s) for redirects — [`docs/configuration/allowed-origins.md`](configuration/allowed-origins.md).
- Confirm a test order from Paper checkout lands in Dashboard Orders.

## Follow-ups (not blocking first deploy)

- Localized error / not-found shells (README Next Steps / international-storefront backlog).
- Draft Mode for unpublished Model changes (Paper app) is not implemented yet.
