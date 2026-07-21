# Architecture Decision Records

Informal north-star for day-to-day conventions: [`skills/saleor-paper-storefront/rules/paper-architecture.md`](../skills/saleor-paper-storefront/rules/paper-architecture.md). File naming and imports: [`code-conventions.md`](../skills/saleor-paper-storefront/references/code-conventions.md).

| ADR                                                 | Title                                                   | Status                         |
| --------------------------------------------------- | ------------------------------------------------------- | ------------------------------ |
| [0001](./0001-locale-channel-url-routing.md)        | Locale and channel URL routing (`/{locale}/{channel}/`) | Accepted (implemented)         |
| [0002](./0002-cms-copy-vs-code-owned-ui-strings.md) | CMS editorial copy vs code-owned UI strings (next-intl) | Accepted (implemented)         |
| [0003](./0003-executable-checks-in-agent-loop.md)   | Executable checks in the agent's feedback loop          | Accepted (implemented)         |
| [0004](./0004-translatable-slugs.md)                | Saleor translatable catalog slugs                       | Accepted (phase 1 in progress) |

**Human overview:** [`docs/international-storefront.md`](../international-storefront.md) — how routing, Saleor translations, CMS copy, and `messages/*.json` fit together.
