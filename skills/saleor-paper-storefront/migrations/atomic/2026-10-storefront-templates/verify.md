# Verify

- [ ] `pnpm run verify` passes.
- [ ] `pnpm guardrails:canary` passes.
- [ ] The product route does not import `@/gql` or `PDP_LAYOUT_CLASSES`.
- [ ] After the release commit exists, `paper-version.json` records `2026-10-storefront-templates` with that SHA. Do not invent one. The schema rejects an empty `upstreamSha`.
