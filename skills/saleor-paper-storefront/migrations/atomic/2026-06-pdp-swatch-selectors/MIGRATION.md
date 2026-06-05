# Migration: PDP SWATCH selectors and multi-attribute selection fixes

## Intent

Support Saleor **Swatch** attribute images on the PDP (labeled pills), fix partial multi-attribute selection (picking option B must not clear option A), auto-apply single-option attributes, and wire the documented `renderers` prop on `VariantSelectionSection`.

## Upstream reference

- **Commit:** [`df9dd13b`](https://github.com/saleor/storefront/commit/df9dd13b)
- **Rules (destination):** [`../../../rules/product-variants.md`](../../../rules/product-variants.md)
- **UI reference:** [`../../../references/variant-selector-ui.md`](../../../references/variant-selector-ui.md)

## Prerequisites

- `2026-06-pdp-ppr-islands` — variant section reads `searchParams` inside a dynamic island
- Run `pnpm run generate` after GraphQL changes

## Out of scope

- Pill/circle **styling** (`border-gray-400`, `h-12`, colors) — **presentation-default**; preserve fork classNames if customized
- PLP filter swatches (only GraphQL fields added on `ProductListItem` for consistency)
- Rewriting a fork's entirely custom variant picker — port utils + GraphQL even if renderers differ

## Discovery

Search for customized variant selection:

```bash
ls src/ui/components/pdp/variant-selection/ 2>/dev/null
grep -r "getAdjustedSelections\|groupVariantsByAttributes" src/ui/components/pdp/
```

If the fork inlined variant logic in `page.tsx` without `variant-selection/`, extract or conceptually port behavior from upstream.

## Steps

### 1. GraphQL — swatch fields `[architecture]`

In `src/graphql/VariantDetailsFragment.graphql` (and shared fragments used on PDP), ensure selection attribute values include:

```graphql
values {
  name
  value
  file { url }
}
attribute {
  slug
  name
  inputType
}
```

Also update `ProductListItem.graphql` and `CheckoutFind.graphql` if the fork uses them for attribute display.

```bash
pnpm run generate
```

### 2. Swatch data layer `[architecture]`

Port or merge `src/lib/colors.ts`:

- `getSwatchData()`, `isSwatchInputType()`, `shouldRenderAsSwatch()`
- Existing `getColorHex()` unchanged for hex/name fallback

### 3. Variant utils `[architecture]`

Port `src/ui/components/pdp/variant-selection/utils.ts` behavior (conceptual merge if fork customized):

| Function                        | Purpose                                                               |
| ------------------------------- | --------------------------------------------------------------------- |
| `normalizeAttributeValueId`     | URL-safe option ids                                                   |
| `variantMatchesSelections`      | Shared matching logic                                                 |
| `hasCompatibleVariant`          | Partial selection compatibility                                       |
| `getImplicitSelections`         | Auto-apply single-option attributes                                   |
| `getInteractiveAttributeGroups` | Hide single-option groups in UI                                       |
| `getAdjustedSelections`         | Keep partial selections; clear only on impossible **complete** combos |
| `findMatchingVariant`           | Accept optional `attributeGroups`; merge implicit selections          |

**Critical bugfix:** Do not treat `findMatchingVariant === undefined` during partial selection as a conflict — use `hasCompatibleVariant`.

### 4. Image swatch renderer `[architecture]` + `[presentation-default]`

Add `src/ui/components/pdp/variant-selection/renderers/image-swatch-pill-option.tsx`:

- Labeled pill (`h-12`), thumbnail + name
- Border states aligned with `ButtonOption` (see `variant-selector-ui.md`)

Register in `renderers/index.ts` as `_imageSwatch`.

Update `variant-selector.tsx` routing: `swatchImageUrl` → pill, `colorHex` → circle.

### 5. Section wiring `[architecture]`

In `variant-selection-section.tsx`:

- Memoize `attributeGroups` once; pass to `findMatchingVariant` / `getAdjustedSelections`
- Render `getInteractiveAttributeGroups(attributeGroups)` only
- Wire `renderers` prop through to `VariantSelector`

### 6. Tests `[architecture]`

Port or run upstream tests:

```bash
pnpm test src/ui/components/pdp/variant-selection/utils.test.ts
```

Fixture `audiobookVariants` covers 3-attribute partial selection.

## Target shape

```
VariantSelectionSection
├── groupVariantsByAttributes (memoized)
├── getInteractiveAttributeGroups → VariantSelector per group
├── getImplicitSelections → merged in findMatchingVariant
└── renderers registry → VariantSelector

VariantSelector
├── swatchImageUrl → ImageSwatchPillOption
├── colorHex → ColorSwatchOption
└── slug / _default → ButtonOption
```

## Verify

[`verify.md`](verify.md)

## Record

`df9dd13b`
