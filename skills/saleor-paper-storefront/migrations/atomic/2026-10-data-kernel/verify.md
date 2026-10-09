# Verify

- [ ] `pnpm run verify` passes.
- [ ] `pnpm guardrails:canary` passes.
- [ ] Fork-owned fields live in `src/graphql/extensions/`, not in core operations.
- [ ] No cached loader hides a Saleor failure with try/catch; optional reads use `allowPartialData`.
- [ ] `paper-version.json` records `2026-10-data-kernel`.
