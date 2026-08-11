# CMS / boilerplate audit (follow-up)

Tracked for Paper after onboarding’s storefront track ships. Not required for first deploy — see [`production-checklist.md`](./production-checklist.md).

## Goals

1. **Clarify required Models** for a blank merchant vs demo seed (`storefront-chrome`, homepage, cart, checkout, policies).
2. **Trim leftover demo defaults** that read as boilerplate once Saleor Models power marketing copy.
3. **Enforce ADR 0002** — editorial → Models; functional UI → next-intl; finish migrations listed in README Next Steps.
4. **Document the Configurator path** so Dashboard onboarding can keep deep-linking here without duplicating ops detail.

## Required vs optional Models

| Tier                              | Models                     | Notes                                                                                         |
| --------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| Recommended for Dashboard editing | policies, chrome, homepage | Site-wide copy + free-shipping / returns facts; shop still works via code defaults if missing |
| Recommended                       | cart, checkout             | Editorial bag/checkout voice                                                                  |
| Optional                          | products                   | PLP title/description                                                                         |
| Skip                              | —                          | Forks / code-only: Paper app **Skip**, or `CONTENT_PROVIDER=code`                             |

Paper app init seeds **all six** when “Add storefront Models” is checked (matches Configurator seed). Merchants edit copy in Dashboard afterward.

## Paper app: Models on initialization

**Decision (product):** Seed Paper’s CMS Models from [`saleor-paper-app`](https://github.com/saleor/saleor-paper-app) as part of the **app initialization screen**, not a silent post-install side effect.

Init choices:

- **Add storefront Models** (default) — create PageTypes + seed pages for homepage, chrome, cart, checkout, policies, products
- **Skip** — fork / already customized / using code-owned content only

Schema + seed source of truth stays in `saleor/storefront` (`config/saleor/storefront-content.snapshot.json`). The app vendors and applies it additively; it does not fork a second definition.

Apply policy: greenfield create + safe re-run (create missing types/attrs/pages; seed values only when empty/new; never delete extras).

## Out of scope here

- Draft Mode for unpublished Model changes (Paper app).
- Onboarding app UI (lives in `saleor/apps` onboarding).
