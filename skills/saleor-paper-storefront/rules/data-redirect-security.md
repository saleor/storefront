---
name: data-redirect-security
description: Redirect URL security for auth emails and checkout/account flows: isAllowedRedirectUrl, redirectUrl, password reset, account confirmation, Host/Origin/X-Forwarded spoofing, NEXT_PUBLIC_STOREFRONT_URL, ALLOWED_EXTRA_ORIGINS, Saleor ALLOWED_CLIENT_HOSTS. Use when touching redirect allowlists or URLs sent to Saleor mutations.
---

# Redirect URL Security

Redirect URLs are security-sensitive everywhere. Any code path that accepts, builds, validates, stores, forwards, or follows a redirect URL must treat the destination origin as attacker-controlled until it has passed the shared allowlist check.

## Rule

Production redirect allowlists must come from explicit configuration, not request metadata.

The allowed origin sources are documented in `docs/configuration/allowed-origins.md`; do NOT copy that list into other code; always reuse `isAllowedRedirectUrl()` for redirect destination checks. Do not duplicate its parsing, normalization, environment handling, or development fallback logic in route handlers, Server Actions, components, or tests.

## Never Trust These For Production Allowlisting

Do not allow these values to introduce a production redirect origin:

- `Host`
- `X-Forwarded-Host`
- `X-Forwarded-Proto`
- `Origin`
- `Referer`
- `request.nextUrl.origin`
- `headers().get(...)`
- helper output derived from request headers, including `getRequestOrigin()`

## Saleor Boundary

Saleor also validates these redirect URLs with [`ALLOWED_CLIENT_HOSTS`]. Keep storefront allowlists aligned with Saleor config, but do not rely on Saleor as the only guard. The storefront check should reject invalid redirect origins before forwarding the mutation.

[`ALLOWED_CLIENT_HOSTS`]: https://docs.saleor.io/setup/configuration#allowed_client_hosts

## Required Tests

When changing redirect validation, auth routes, or checkout auth actions, add or keep tests that prove:

- A redirect URL matching only `request.nextUrl.origin` or `getRequestOrigin()` is rejected in production.
- Spoofed `Host` or `X-Forwarded-*` derived origins do not become allowed production origins.
- Configured storefront, checkout, and extra origins are accepted.
- Loopback request origins are accepted only outside production.
- Foreign origins, subdomain tricks, non-http schemes, protocol-relative URLs, and malformed URLs are rejected.

## Anti-patterns

- Do not use `allowed.push(request.nextUrl.origin)`
- Do not use `allowed.push(await getRequestOrigin())`
- Do not treat `Origin` as a redirect allowlist source.
- Do not fix failing tests by broadening the allowlist to request headers.
- Do not add preview or deployment hosts implicitly unless the helper already supports that exact env source.
