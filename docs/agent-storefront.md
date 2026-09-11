# Agent storefront discovery

Set `STOREFRONT_AGENTS_ENABLED=true` and rebuild. `.env.example` enables new storefronts; absent or other values disable routes, negotiation, links, and the footer entry. Existing storefronts remain disabled.

## Public entry points

- `/agents.md` and `/llms.txt`: store identity, public GraphQL URL, locale/channels, available currencies, policy links, and a catalog query.
- `/agents/catalog.md`: search, pagination, variants, prices, and availability examples.

Only the public API URL is exposed. Listed channels do not control Saleor access.

## Markdown pages

Append `.md` or send `Accept: text/markdown` for:

- `/{locale}/{channel}`
- `/{locale}/{channel}/products[/{slug}]`
- `/{locale}/{channel}/categories/{slug}`
- `/{locale}/{channel}/collections/{slug}`
- `/{locale}/{channel}/pages/{slug}`

Listings ignore query parameters; use GraphQL for filtering, sorting, and pagination. Variants follow the PDP cap. Prices and quantities are cached snapshots, not guarantees.

HTML advertises Markdown through headers and metadata. Accept quality weights apply; wildcards remain HTML. Negotiation excludes user-agent sniffing, React Flight, prefetches, non-GET/HEAD requests, and transactional/account routes. The handler validates flag, locale/channel, and path.

## Caching and deployment

Markdown reuses cached loaders and responds with `Cache-Control: private, no-store` and `Vary: Accept`. Next.js 16.3.4 overwrites HTML's middleware Vary header; tested production HTML is private/no-store. External CDNs overriding origin caching must key on `Accept`. Explicit `.md` URLs have distinct keys.

Rebuild after toggling because metadata and discovery may be prerendered. Set `NEXT_PUBLIC_STOREFRONT_URL` to the canonical origin. Discovery neither trusts request Host nor guesses unavailable currencies.

## Smoke checks

```sh
curl -i http://localhost:3000/agents.md
curl -i http://localhost:3000/en/default-channel/products.md
curl -i -H 'Accept: text/markdown' http://localhost:3000/en/default-channel/products
curl -i -H 'Accept: text/html' http://localhost:3000/en/default-channel/products
```

Use the deployed locale/channel. Verify content types, no cookies, links, and cache separation in both request orders. Without the variable, agent URLs must return 404, HTML remain HTML, and the footer link disappear.
