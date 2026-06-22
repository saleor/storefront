# Local dev scripts

**Not committed** — everything in this directory is gitignored except this README.

Use `scripts/local/` for personal or in-progress tooling: one-off experiments, instance-specific helpers, WIP scripts not ready for the repo.

## Conventions

| Location         | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `scripts/`       | Shared tooling — wired in `package.json`, documented in READMEs |
| `scripts/local/` | Private scripts — gitignored, safe to iterate without PR noise  |

Import shared helpers from `scripts/lib/` via relative paths (e.g. `../lib/catalog-translations.mjs`).

When a script is ready to share: move it to `scripts/`, add a `package.json` command, and document the workflow.
