# Agent storefront discovery

Set `STOREFRONT_AGENTS_ENABLED=true` and rebuild/redeploy to enable public agent discovery. New storefronts copying `.env.example` get this setting. An absent variable, `false`, or any other value disables all feature routes, negotiation, metadata links, and the small **For AI agents** footer link. Existing storefronts do not opt in implicitly.

## Public entry points

- `/agents.md`: generated store identity, public Saleor GraphQL endpoint, allowed locale/channel combinations, currency metadata when available, footer/policy links, and a working public catalog query.
- `/llms.txt`: the same document.
- `/agents/catalog.md`: search, pagination, product variants, prices, and availability query examples.

Only the public API URL is advertised. No app token or customer session is returned. Channel metadata can use the existing server-side app helper, but catalog queries and Markdown pages use the existing public loaders. The published channel list is guidance, not access control on the underlying Saleor endpoint.

## Markdown pages

Append `.md` to these canonical storefront URLs, or request the normal URL with `Accept: text/markdown`:

- `/{locale}/{channel}`
- `/{locale}/{channel}/products`
- `/{locale}/{channel}/products/{slug}`
- `/{locale}/{channel}/categories/{slug}`
- `/{locale}/{channel}/collections/{slug}`
- `/{locale}/{channel}/pages/{slug}`

The homepage provides its introduction and collection links. Listings contain the canonical first page: filters, sorting, cursors, and other query parameters are not applied. Use the documented GraphQL queries for these operations. Product variants follow the existing PDP cap/strategy; extended catalogs are explicitly directed to paginated GraphQL instead of being silently truncated. Prices and quantities are cached snapshots, never a delivery or final-total guarantee.

HTML browse pages advertise Markdown via `Link` response headers and metadata alternate links. The tiny footer link uses a plain anchor to the discovery document. Wildcard Accept headers alone stay HTML; explicit quality weights are respected. User-agent sniffing is not used. React Flight, prefetches, and non-GET/HEAD requests are excluded from negotiation. Transactional/account routes have no Markdown representation.

The implementation rewrites to `/agent-pages/[...path]`. That handler independently checks the flag, locale/channel allowlists, and supported public paths, including requests made directly to it.

## Caching and deployment

Markdown uses existing cache-manifest-backed loaders and `Cache-Control: private, no-store` on responses, avoiding a separate stale CDN catalog cache. Markdown responses include `Vary: Accept` alongside Next.js's own fields. Next.js 16.3.4 overwrites middleware's Vary header on HTML pages; the tested production HTML responses are also private/no-store. Keep middleware negotiation ahead of the page cache. Any external CDN that overrides origin caching must explicitly include `Accept` in its cache key for these URLs; relying on HTML's Vary header is insufficient. Explicit `.md` URLs always have a distinct cache key. Never configure a shared cache to serve Markdown as HTML or vice versa.

Rebuild after toggling the flag: metadata, footer, and discovery can be prerendered. Set `NEXT_PUBLIC_STOREFRONT_URL` to the public canonical origin; discovery never derives trusted URLs from a request Host header. Currency is omitted in favor of API guidance when channel metadata is unavailable, rather than guessed from a fallback currency.

## Smoke checks

With the flag enabled:

```sh
curl -i http://localhost:3000/agents.md
curl -i http://localhost:3000/llms.txt
curl -i http://localhost:3000/en/default-channel/products.md
curl -i -H 'Accept: text/markdown' http://localhost:3000/en/default-channel/products
curl -i -H 'Accept: text/html' http://localhost:3000/en/default-channel/products
```

Use the deployment's actual locale/channel. Check the Markdown Content-Type, absence of cookies, alternate links, and HTML/Markdown cache separation in both request orders. After rebuilding with the variable unset, discovery and explicit Markdown URLs must return 404, HTML must stay HTML, and the footer link must be absent.
