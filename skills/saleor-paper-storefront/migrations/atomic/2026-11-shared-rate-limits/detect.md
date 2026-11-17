# Detect

Pending when the shared limiter is missing, or the auth limiter still keeps counts in a module-level `Map`.

```bash
test -f src/lib/rate-limit/limiter.ts && ! grep -q "new Map<string, RateLimitBucket>" src/lib/auth/auth-rate-limit.ts
```
