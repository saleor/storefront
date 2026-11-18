# Verify

- [ ] `pnpm run verify` passes.
- [ ] No file outside `src/lib/rate-limit/` reads `x-forwarded-for` or `x-real-ip` for a client IP: `grep -rn "x-forwarded-for\|x-real-ip" src --include="*.ts" --include="*.tsx"`.
- [ ] Every `rejectIfRateLimited(` call is awaited.
- [ ] Production and preview environments have a rate-limit store configured: the server log has no `[rate-limit]` warning at start.
- [ ] After the release commit exists, `paper-version.json` records `2026-11-shared-rate-limits` with that SHA. Do not invent one.
