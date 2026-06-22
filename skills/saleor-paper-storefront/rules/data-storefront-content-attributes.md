# Storefront Content — Attribute Types

How to choose Saleor attribute `inputType`s on storefront Models, and what Paper reads today.

> **Models setup**: `data-storefront-content-saleor.md`  
> **Runtime layer**: `data-storefront-content.md`  
> **Slug contract**: `src/lib/content/attribute-slugs.ts`

---

## Catalog vs copy (don't duplicate entities)

Collections and categories already have **name**, **description** (rich text), and **image** in Saleor.

| Store in Models                                                 | Store in catalog API                           |
| --------------------------------------------------------------- | ---------------------------------------------- |
| Section heading when editorial (e.g. "Staff picks")             | Collection/category **name**                   |
| **Reference** to which collection/category (slug via attribute) | **Description**, **image**, product membership |
| Hero copy, trust labels, booleans                               | Product fields                                 |

Use **reference attributes** for pointers; fetch display fields from `src/lib/catalog/` when rendering.

---

## Reference attributes (Saleor 3.22+)

| Configurator `inputType` | Cardinality | `entityType` examples                       | Paper use                                  |
| ------------------------ | ----------- | ------------------------------------------- | ------------------------------------------ |
| `SINGLE_REFERENCE`       | One         | `COLLECTION`, `CATEGORY`, `PRODUCT`, `PAGE` | Featured collection slug on homepage       |
| `REFERENCE`              | Many        | Same                                        | Future: collection list (multi-collection) |

Configurator seed values use the **target entity slug** (e.g. `featured-products`).

GraphQL: `AssignedSingleCollectionReferenceAttribute`, `AssignedMultiCollectionReferenceAttribute`, and siblings for category/product/page — extend `StorefrontContentPages.graphql` per type.

---

## Scalar & media types (roadmap)

| `inputType`                       | Typical storefront use                        | Wired in Paper                                                           |
| --------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| `PLAIN_TEXT`                      | Headings, labels, short copy                  | Yes                                                                      |
| `BOOLEAN`                         | Dismissible flags, toggles                    | Yes                                                                      |
| `SINGLE_REFERENCE` + `COLLECTION` | Featured collection override                  | Yes (`featured-collection`)                                              |
| `SINGLE_REFERENCE` + `CATEGORY`   | Category spotlight                            | No                                                                       |
| `REFERENCE` + `COLLECTION`        | Collection list ordering                      | No                                                                       |
| `RICH_TEXT`                       | Long copy, collection description on homepage | No — prefer catalog `description` for entities                           |
| `FILE`                            | Hero / editorial images                       | No                                                                       |
| `DROPDOWN` / `SWATCH`             | Layout variants (e.g. image left/right)       | No — code enum today for editorial position                              |
| `NUMERIC`                         | Policy values, limits, counts                 | Yes — `free-shipping-threshold`, `returns-window-days`, `featured-limit` |

`NUMERIC` is read via `attrNumber()` (`buildAttributeMap` stores the `Float` directly); `attrInt()` truncates it. Use `NUMERIC` for any value consumed by logic or formatted as money/count — not `PLAIN_TEXT`. Policy money values are stored in the channel currency; format with the live cart currency (cart drawer) or `resolveChannelCurrency()` (chrome/homepage), then interpolate via `buildPolicyLabelValues()` + `formatContentLabel()`.

Add types in this order when a section needs them: extend GraphQL fragment → mapper helper in `attributes.ts` → `attribute-slugs.ts` → Configurator (commerce-as-code) → Dashboard for merchandisers.

---

## Adding a reference attribute (checklist)

1. `contentAttributes` in `storefront-content.config.yml` with `inputType` + `entityType`.
2. Assign on the relevant `modelTypes` entry.
3. Slug constant in `attribute-slugs.ts` (verify script matches display name).
4. Fragment inline on `AssignedSingle*ReferenceAttribute` / `AssignedMulti*ReferenceAttribute`.
5. `pnpm run generate` → mapper reads slug(s) → `types.ts` + `defaults.ts` fallback.
6. Section/catalog code consumes slug; **metadata** from catalog queries.

---

## Anti-patterns

- Storing collection **title** or **description** on `storefront-homepage` when the section showcases that collection.
- Using `PLAIN_TEXT` for a collection slug — no Dashboard picker, no validation.
- Extending GraphQL for a type before you have a section that needs it (YAGNI) — except document roadmap here.
