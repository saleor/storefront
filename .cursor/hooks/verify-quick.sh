#!/bin/bash
# Cursor "stop" hook — the cheapest deterministic gate, run when the agent
# finishes a turn. Catches the most common agent mistake (hardcoded color
# literals) and nudges the agent to fix them before the session ends.
#
# Design choices (see ADR 0003):
#   - fires on `stop`, NOT `afterFileEdit` — per-edit would be too noisy/slow.
#   - runs only `lint:design-tokens` — pure local file scan, no network, no
#     GraphQL codegen. typecheck/build are too heavy for a per-turn hook.
#   - fail-open: on any error (pnpm missing, timeout, unexpected), exit 0 with
#     no output. This hook never blocks the agent from stopping; it only nudges.
#   - silent on success — zero noise when the codebase is clean.
#
# Disable: delete this file's entry from .cursor/hooks.json (or the whole file).
set -u

# Consume the stop-event JSON on stdin (we don't need it, but it must be drained).
cat >/dev/null 2>&1

# Resolve pnpm robustly; if anything is missing, fail open silently.
if ! command -v pnpm >/dev/null 2>&1; then
	exit 0
fi

# Design tokens and the data-layer lock. Both are local and fast. Silent when clean.
messages=""

token_out="$(pnpm run lint:design-tokens 2>&1)" || messages="lint:design-tokens failed — there are raw hex/rgb()/hsl() color literals in src/ui styling. Fix them by using a brand.css token (bg-background, text-foreground, etc.) before declaring done. Add a \`design-tokens-allow\` comment only for a rare legitimate literal. Lint output:\n\n${token_out}"

lock_out="$(node scripts/data-layer-lock.mjs --check 2>&1)" || messages="${messages:+${messages}\n\n}data-layer.lock.md is stale. Run pnpm data:lock and review the diff before declaring done. Output:\n\n${lock_out}"

if [ -z "$messages" ]; then
	exit 0
fi

escaped="$(printf '%s' "$messages" | node -e 'let s=require("fs").readFileSync(0,"utf8");process.stdout.write(JSON.stringify(s).slice(1,-1));')"

cat <<EOF
{
  "followup_message": "${escaped}"
}
EOF
exit 0
