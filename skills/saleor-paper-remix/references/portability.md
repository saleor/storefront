# Skill Portability

Use `skills/saleor-paper-remix/SKILL.md` as the canonical workflow. This skill is repo-local: it references Paper's current source tree and does not make sense as a standalone global package.

## Recommended Layout

| Tool                       | Install                                                           |
| -------------------------- | ----------------------------------------------------------------- |
| Any supported coding agent | `npx skills add . --skill saleor-paper-remix --agent '*'`         |
| Codex only                 | `npx skills add . --skill saleor-paper-remix --agent codex`       |
| Claude Code only           | `npx skills add . --skill saleor-paper-remix --agent claude-code` |
| Cursor only                | `npx skills add . --skill saleor-paper-remix --agent cursor`      |

## Tradeoffs

`skills/` is the source package. It should stay committed in this repository.

Do not commit installed copies under `.agents/skills/`, `.claude/skills/`, `.cursor/skills/`, or other agent-specific directories. Let `npx skills` create those for each developer or CI environment.

Do not maintain a Claude slash command as the source of truth. It recreates the same portability problem and drifts from the repo-local skill.

`AGENTS.md` and README should only document the install command and link to the skill.

## Maintenance Rule

When Paper architecture changes, update the canonical skill. Users can reinstall or update through the `skills` CLI after pulling the repo.
