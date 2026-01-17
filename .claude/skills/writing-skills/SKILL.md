---
name: writing-skills
description: Create and maintain AI agent skills for this project. Use when creating new skills, reviewing existing skills, or deciding what deserves to be a skill.
---

# Writing Skills

> **Context**: AI agent configuration is still evolving. Multiple approaches exist, none fully standardized yet.

## Approaches to AI Agent Instructions

| Approach                           | Scope                                     | Tool Support                  |
| ---------------------------------- | ----------------------------------------- | ----------------------------- |
| **[AGENTS.md](https://agents.md)** | Emerging open standard (Linux Foundation) | Cursor, Claude, Codex, others |
| **`.cursorrules`**                 | Cursor-specific                           | Cursor only                   |
| **`.claude/`**                     | Claude-specific conventions               | Claude Code                   |

This project uses a hybrid approach:

- `AGENTS.md` as the main index (tool-agnostic)
- `.cursorrules` for Cursor-specific condensed rules
- `.claude/skills/` for modular, reusable instructions

> **Note**: The skills pattern we use is inspired by [Sentry's exploration](https://github.com/getsentry/skills) of modular prompts. It's not a formal standard - we're experimenting with what works best.

## When to Use This Skill

Use when:

- Creating a new skill for this project
- Reviewing or updating existing skills
- Deciding what deserves to be a skill vs inline documentation

## Skill Structure

Every skill requires **YAML frontmatter** followed by markdown content:

```markdown
---
name: skill-name
description: What this skill does. Use when [trigger conditions users would say].
---

# Skill Title

> **Source**: [Link](url) - Brief description

## When to Use

Clear trigger conditions (mirrors description)

## Instructions

Step-by-step guidance, code examples, file locations

## Examples (optional)

Before/after or input/output examples

## Anti-patterns

What NOT to do
```

### Required Frontmatter Fields

| Field         | Purpose                                                          |
| ------------- | ---------------------------------------------------------------- |
| `name`        | Unique identifier (kebab-case, matches folder name)              |
| `description` | **Critical**: Claude uses this to decide when to apply the skill |

### Optional Frontmatter Fields

| Field            | Purpose                                        | Example                 |
| ---------------- | ---------------------------------------------- | ----------------------- |
| `allowed-tools`  | Restrict which tools the skill can use         | `Read, Bash, WebSearch` |
| `user-invocable` | Control visibility in `/` menu (default: true) | `false`                 |
| `context`        | Run in forked context                          | `fork`                  |

### Writing Effective Descriptions

The `description` field is **how Claude discovers your skill**. Include:

1. **What it does**: Specific capabilities
2. **Trigger keywords**: Terms users would naturally say

```yaml
# ❌ Bad - too vague
description: Helps with GraphQL

# ✅ Good - specific with triggers
description: Modify GraphQL queries and regenerate types. Use when editing .graphql files, adding fields to queries, or seeing TypeScript errors about missing GraphQL types.
```

## What Makes a Good Skill

| ✅ Good Skill                       | ❌ Not a Skill                       |
| ----------------------------------- | ------------------------------------ |
| Project-specific patterns           | Generic language/framework knowledge |
| Complex multi-step workflows        | Single commands                      |
| External integrations (Saleor APIs) | Standard library usage               |
| Decisions requiring project context | Obvious best practices               |

### When to Include State Machines

For complex interactive features, include a Mermaid state diagram when:

- Multiple states with non-obvious transitions
- Auto-adjustment or conflict resolution behavior
- URL/state synchronization
- Async operations with race conditions

Example: See `variant-selection` skill - the state machine prevents edge case bugs like "what happens when user selects an incompatible option?"

## Source References

**Always include sources** for:

- External API documentation (may change between versions)
- Third-party library patterns
- Architectural decisions with rationale

**Format**:

```markdown
> **Source**: [Name](url) - Why this is referenced
```

**Verify sources**:

- Check links are valid
- Note if behavior varies by version
- Add "verify in Dashboard/docs" for volatile info

## File Structure

```
.claude/skills/[skill-name]/
  SKILL.md              # Main skill (required) - overview and quick start
  REFERENCE.md          # Optional: detailed reference docs
  STATE_MACHINE.md      # Optional: state diagrams for complex features
  examples/             # Optional: example files
```

### Progressive Disclosure Pattern

For complex skills, keep `SKILL.md` focused and link to supporting files:

```markdown
# In SKILL.md

For detailed function reference, see [REFERENCE.md](REFERENCE.md).
For state transition rules, see [STATE_MACHINE.md](STATE_MACHINE.md).
```

This keeps startup fast (Claude only loads `SKILL.md` names/descriptions initially) while providing depth when needed.

## Naming

- kebab-case: `graphql-workflow`, `variant-selection`
- Be specific: `saleor-investigation` not `investigation`
- Action-oriented: `writing-skills` not `skill-guidelines`

## When NOT to Create a Skill

- **Generic knowledge**: Next.js, TypeScript, React basics - AI knows these
- **One-liner**: Single command or config option
- **Temporary**: Workarounds that will be removed
- **Too broad**: "How to code" - break into specific skills

## Keeping Skills Updated

Skills are like code:

- Update when underlying systems change
- Remove when no longer relevant
- Review source links periodically
- Note Saleor/library version if behavior is version-specific

## Anti-patterns

❌ **Don't skip YAML frontmatter** - Required for Claude to discover the skill  
❌ **Don't write vague descriptions** - Be specific with trigger keywords  
❌ **Don't claim standards** - This is our pattern, not "the" standard  
❌ **Don't include generic docs** - AI already knows Next.js/React  
❌ **Don't skip source links** - Unverified info leads to errors  
❌ **Don't write novels** - Keep `SKILL.md` focused, use supporting files for depth
