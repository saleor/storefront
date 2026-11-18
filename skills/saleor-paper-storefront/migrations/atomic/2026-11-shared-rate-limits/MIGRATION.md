# 2026-11-shared-rate-limits

Rate limits for sign-in, password reset and guest order lookup move from per-instance memory to a shared store, with per-email and per-order limits on top of per-IP.

`upstreamSha` stays empty until the commit that releases this migration exists.

## Why

The old limiter kept counts in a module-level `Map`. On serverless hosting each instance counted on its own and a cold start forgot, and the only key was the IP, so rotating IPs bypassed it. Guest order lookup by number runs with an app token that can read every order, so it needs a real limit.

## Steps

1. Take `src/lib/rate-limit/` from upstream as is, and the new `src/lib/auth/auth-rate-limit.ts`. `rejectIfRateLimited` is now async: add `await` in every `/api/auth/*` route, including routes the fork added.
2. Port the per-account limits into the fork's login and reset-password routes (`rejectIfAccountLimited`) and into the checkout actions `registerCheckoutAccount` / `requestCheckoutPasswordReset` (`limitAuthAttempt`, `limitAccountAttempt`), and the per-email / per-order limits into `src/app/(checkout)/order-actions.ts`. Count before doing the work (`consumeAttempt`); do not check, work, then record.
3. Replace any code that reads `x-forwarded-for` or `x-real-ip` for an IP with `clientIpFromHeaders` from `@/lib/rate-limit`.
4. Configure the store in every production and preview environment: `RATE_LIMIT_REDIS_REST_URL` and `RATE_LIMIT_REDIS_REST_TOKEN`, or the `KV_REST_API_*` / `UPSTASH_REDIS_REST_*` variables Upstash sets (on Vercel: Marketplace → Upstash for Redis). Without one, everything keeps working but limits count per server instance, and production logs a warning at start (`src/instrumentation.ts`; merge it into the fork's own `register()` if it has one). `RATE_LIMIT_STORE=required` refuses guest order lookups instead.
5. Self-hosting: set `TRUSTED_PROXY_COUNT` to the number of proxies in front of Paper that append to `X-Forwarded-For` (default 1).
6. Optional: `RATE_LIMIT_SECRET` for the key hashing (falls back to `ORDER_VIEW_SECRET`, then `REVALIDATE_SECRET`).
7. Run `pnpm run verify`.
