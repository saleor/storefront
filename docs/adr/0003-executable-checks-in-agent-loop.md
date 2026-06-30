# ADR 0003: Executable checks in the agent's feedback loop

**Status:** Accepted
**Date:** 2026-06-25 (accepted 2026-06-29)
**Deciders:** Paper storefront team
**Implementation:** Shipped — `pnpm run verify` (+ `verify:quick`) is the composed gate; `design-verification.md` and the always-on `AGENTS.md` point at it. The Cursor `hooks.json` question remains open (see Open questions) and is intentionally _not_ part of this acceptance.

## Context

The engineering feedback loop in this repo is already serious: type checking (`tsc --noEmit`),
tests (`vitest`, ~69 colocated `*.test.ts` files), GraphQL codegen, ESLint/Prettier, a
domain-specific design-token guard (`scripts/check-design-tokens.mjs`), and a production build.
None of this is novel — it is standard practice.

What the quote that prompted this ADR sharpens is **who consumes that feedback**:

> Instructions tell the agent what should be true. Executable checks tell it when it is wrong.

Today most of Paper's feedback loop reaches an AI agent as **instructions**, not as **executable
signal on its path**:

- **The "which checks to run" knowledge lives in prose** — `.cursorrules`, `AGENTS.md`, and the
  `design-verification` skill rule (with a "when to run what" matrix). Whether the loop closes
  depends on the agent reading and obeying, every turn. That is exactly the _instructions_ half
  the quote calls weaker.
- **The only forced local gate is thin.** `.husky/pre-commit` runs `lint-staged`
  (`.lintstagedrc.js`), which is `eslint --fix` + `prettier` on staged files. **No `tsc`, no
  tests.** Type errors and red tests sail through to CI.
- **The authoritative signal (`tsc`, `test:run`) is opt-in locally** and only mandatory in CI
  (`.github/workflows/build.yml`: typecheck → test → build). CI is minutes away — outside the
  agent's inner loop.
- **There is no single "am I done?" command.** The agent must assemble the right subset of gates
  from the matrix itself — a place to quietly skip a step.

Two existing choices are genuinely good and we want to **keep** them:

- **Codegen is self-healing.** `pretypecheck` / `prebuild` / `predev` run `generate:all` first
  (`package.json`), so a typecheck can never run against stale GraphQL types. This removes a whole
  class of "forgot to regenerate" failures.
- **The hard-gate vs advisory split** in `design-verification.md` already distinguishes
  _deterministic executable truth_ (token lint, `tsc`, lint) from _judgment calls_ (PPR
  boundaries, LCP, client-JS budget) — and **deliberately refuses to turn the latter into brittle
  CI walls** to protect hand-coder DX.

That last point is the tension this ADR must resolve. "Put every check in the agent's path and
make it block" would contradict a deliberate Paper value. So the decision is not "enforce more
everywhere"; it is "make the _deterministic_ gates executable and automatic for the _agent_, while
keeping the human prototyping path unblocked and the _judgment_ gates advisory."

## Decision

Adopt the principle as a stance, and split enforcement by **who consumes the feedback** and
**whether the check is deterministic**.

### 1. Two classes of check (generalize the existing split)

| Class                   | Examples                                                                  | Nature                         | Where it lives                                      |
| ----------------------- | ------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------- |
| **Deterministic gates** | `tsc --noEmit`, `lint`, `lint:design-tokens`, `test:run`, (build for PPR) | Pass/fail, no judgment         | **Executable + on the agent's path** (this ADR)     |
| **Advisory / judgment** | unnecessary `"use client"`, LCP, client-JS budget, content boundary, a11y | Requires human/agent reasoning | **Prose-guided** (`design-verification`, unchanged) |

Only deterministic gates get auto-enforced. Advisory checks stay exactly as they are — guided
review, not walls. This preserves the hand-coder DX the `design-verification` rule protects.

### 2. One canonical "am I done?" command

Add a composed `verify` script so "done" is a single executable command instead of a matrix to
interpret:

```
pnpm run verify  →  docs:check && lint:design-tokens && typecheck && lint && test:run
```

(`typecheck` already runs `generate:all` via its prehook, so this is also codegen-correct.)
`docs:check` (frontmatter present on every rule + compiled `AGENTS.md` in sync with `rules/`) was
added so the agent-doc system can't silently rot — it is deterministic, so it belongs in the gate.
`pnpm run verify:quick` (`lint:design-tokens && typecheck`) is the change-scoped subset for a
styling inner loop. This is the command an agent runs to know it is back inside the boundaries, and
the command the skills point at instead of listing steps.

### 3. The agent's path, not the human's commit

Enforcement is **agent-aware**, deliberately asymmetric:

- **Agent loop:** the agent runs `verify` (or the relevant subset from the change-type matrix)
  after a change, interprets failures, and **iterates until green** before declaring done. This is
  the behavior the skills mandate; this ADR makes it concrete and gives it one command.
- **Optional automation:** a Cursor hook (`hooks.json`, afterEdit/stop) MAY run the fast
  deterministic gates and feed failures back to the agent automatically — turning "the agent
  should run checks" into "checks run on the agent's behalf." See Open questions before adopting.
- **Human path stays unblocked.** `.husky/pre-commit` stays thin (lint/format only). We do **not**
  add `tsc`/tests as a blocking commit/push wall, so prototyping is never gated. CI remains the
  shared source of truth and the backstop.

### 4. Keep codegen self-healing

No change — `predev`/`prebuild`/`pretypecheck` → `generate:all` stays. It is the model example of
making a check impossible to get wrong, and `verify` inherits it.

## Alternatives considered

| Option                                                   | Rejected because                                                                                          |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Status quo (prose only)                                  | Loop closes only if the agent reads and obeys every turn; the authoritative signal is opt-in locally      |
| Make `pre-commit` run `tsc` + tests (block all commits)  | Contradicts `design-verification`'s deliberate "no brittle walls"; punishes human prototyping/WIP commits |
| Block on advisory checks too (PPR, LCP, client-JS, a11y) | They are judgment calls; auto-failing them produces false positives and erodes trust in the gate          |
| CI-only enforcement                                      | Feedback arrives minutes later, outside the agent's inner loop — too slow to "keep iterating"             |
| Mandatory Cursor hook now                                | Real risk of noise/latency/false-positives; needs validation first (see Open questions) — stays opt-in    |

## Consequences

### Positive

- **Executable truth on the agent's path** — one `verify` command tells the agent when it is
  wrong, instead of a prose matrix telling it what should be true.
- **Faster inner loop** — deterministic failures surface locally in seconds, not at PR time.
- **DX preserved** — humans can still commit WIP; advisory checks stay guided; no new CI walls.
- **Skills get simpler** — `design-verification` and `.cursorrules` can point at `verify` rather
  than enumerate commands, reducing drift between docs and reality.
- **Codegen correctness is inherited**, not re-stated.

### Negative / costs

- **A `verify` run is slower than nothing** — for tiny edits the agent should still run the
  change-scoped subset (token-lint+tsc for styling; add tests for logic), per the matrix.
- **Two enforcement surfaces** (agent loop vs CI) must stay in sync — `verify` should mirror what
  CI runs, or the two diverge.
- **A Cursor hook, if adopted, adds latency/noise** to every edit and must be tuned; a bad hook is
  worse than none.
- **Advisory checks remain unenforced by construction** — that is intentional, but it means a11y/PPR
  regressions still rely on agent/human diligence.

### Follow-up work

1. ~~Add the `verify` script to `package.json` and point `design-verification` + `.cursorrules` at
   it.~~ **Done (2026-06-29).** `.cursorrules` was retired in the same effort; the single always-on
   `AGENTS.md` and `design-verification.md` now point at `verify`.
2. Decide the Cursor `hooks.json` question (see Open questions) — prototype, measure latency/noise,
   then accept or reject in a follow-up to this ADR. **In trial (2026-06-29):** a conservative `stop`
   hook running `lint:design-tokens` only (fail-open) is live in `.cursor/hooks.json`; accept/reject
   pending measured noise/latency across real sessions.
3. Keep `verify` mirrored with `.github/workflows/build.yml` so local and CI truth match.

## Open questions

> The ADR is **Accepted**; `verify` and `doctor` shipped. The Cursor-hook question is now being **trialed** rather than left open — see below. Items still genuinely unresolved are marked.

- **Hook or no hook? — TRIALING (2026-06-29).** A `stop` hook was added (`.cursor/hooks.json` + `.cursor/hooks/verify-quick.sh`). To respect this ADR's "measure first, stay opt-in" stance, it is configured conservatively: fires on `stop` (not `afterFileEdit`), runs **only `lint:design-tokens`** (fast, local, no network/codegen — `tsc`/`build` are too heavy for a per-turn hook), is **fail-open** (nudges via `followup_message`, never blocks stop), and is silent on a clean tree. Disable by removing the entry from `.cursor/hooks.json`. **Accept or reject in a follow-up once we have measured noise/latency across real sessions.**
- **Scope of the hook — resolved for the trial.** `lint:design-tokens` only. `tsc`/tests stay in the agent-driven `verify`/`verify:quick`, not the automatic hook. Change-scoped test selection is still open but out of scope for this trial.
- **Where does the build fit? — still open.** Build remains CI-only + advisory ("run `pnpm run build` on PPR-sensitive layout changes", per `design-verification.md`). The faster proxy question may be revisited via the opt-in `next-dev-loop` workflow skill (see `skills/saleor-paper-storefront/README.md`) for PPR debugging, but that is per-task machinery, not an inner-loop gate.
- **Failure interpretation — addressed by the hook's design.** The hook embeds the actionable next step (use a `brand.css` token; `design-tokens-allow` for rare exceptions) in the followup, not just raw output. `verify` itself still surfaces raw tool output, which has been sufficient.
- **Does this belong in a skill instead of an ADR? — settled.** The executable architecture (`verify`, `doctor`, the hook) lives here and in `package.json`/`.cursor/`; the _behavioral_ guidance ("run `verify` before declaring done", the change-type matrix) lives in `design-verification.md`. Both point at the same commands, so they can't drift.

### Workflow skills (opt-in)

`next-dev-loop` and `next-cache-components-optimizer` (first-party Next.js skills from `vercel/next.js`) are documented as **opt-in per-machine add-ons** in `skills/saleor-paper-storefront/README.md` — not pinned in `skills-lock.json`, not installed by `skills:bootstrap`. They require `agent-browser` ≥0.27 + a running `next dev` and are machinery for PPR/build and cache-tightening tasks, not always-on context. Paper's architectural rules stay authoritative; these execute within Paper's boundaries.

## References

- Prompt/principle: "Put the existing engineering feedback loop in the agent's path."
- Design gates today: `skills/saleor-paper-storefront/rules/design-verification.md`
- Design-token guard: `scripts/check-design-tokens.mjs`
- CI backstop: `.github/workflows/build.yml`
- Thin local gate: `.husky/pre-commit`, `.lintstagedrc.js`
- Codegen prehooks: `package.json` (`predev` / `prebuild` / `pretypecheck`)
- Cursor `stop` hook (trial): `.cursor/hooks.json`, `.cursor/hooks/verify-quick.sh`
- Agent-setup health check: `scripts/paper-doctor.mjs` (`pnpm doctor`)
- Opt-in Next.js workflow skills: `skills/saleor-paper-storefront/README.md`
- ADR 0001: Locale and channel URL routing — `docs/adr/0001-locale-channel-url-routing.md`
- ADR 0002: CMS copy vs code-owned UI strings — `docs/adr/0002-cms-copy-vs-code-owned-ui-strings.md`
