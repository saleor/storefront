---
name: product-variants
description: Variant selection state machine on PDP: selection vs non-selection attributes, swatch renderers, partial selection, URL-driven variant param. Use when changing variant pickers or add-to-cart enablement.
---

# Variant Selection

Variant and attribute selection on product detail pages. Ensures correct "Add to Cart" button state, option availability, discount badges, and URL-driven selection.

> **Source**: [Saleor Docs - Attributes](https://docs.saleor.io/developer/attributes/overview) - How product/variant attributes work

> **UI & renderers:** For border states, swatch pills, sizing, and renderer routing, see
> [../references/variant-selector-ui.md](../references/variant-selector-ui.md).

## Core Concept: Variants, Not Products

**You add VARIANTS to cart, not products.** Each variant is a specific attribute combination:

| Product | Attributes     | Variant ID |
| ------- | -------------- | ---------- |
| T-Shirt | Black + Medium | `abc123`   |
| T-Shirt | Black + Large  | `def456`   |
| T-Shirt | White + Medium | `ghi789`   |

The `checkoutLinesAdd` mutation requires a specific `variantId`. Without selecting ALL attributes, there's no variant to add.

## Two Types of Variant Attributes

Saleor distinguishes between two types of variant attributes:

| Type              | `variantSelection`      | Purpose                                | UI                  | Passed to Cart?           |
| ----------------- | ----------------------- | -------------------------------------- | ------------------- | ------------------------- |
| **Selection**     | `VARIANT_SELECTION`     | Identify which variant (color, size)   | Interactive picker  | No - just the `variantId` |
| **Non-Selection** | `NOT_VARIANT_SELECTION` | Describe the variant (material, brand) | Display-only badges | No - already on variant   |

**Key insight:** Neither type is "passed" to checkout. You only pass the `variantId`. All attributes are already stored on the variant in Saleor.

```graphql
# GraphQL queries use the variantSelection filter:
selectionAttributes: attributes(variantSelection: VARIANT_SELECTION) { ... }
nonSelectionAttributes: attributes(variantSelection: NOT_VARIANT_SELECTION) { ... }
```

Non-selection attributes are **display-only** - shown as informational badges, not interactive selectors.

## Saleor Swatch Attributes

Saleor `inputType: SWATCH` attributes may provide a **hex color** (`value`), an **image** (`file.url`), or both. Common on demo catalog for Color and Audio quality.

Required GraphQL on `VariantDetailsFragment.graphql`:

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

After changes: `pnpm run generate`.

| Swatch data    | Renderer                | UI                                |
| -------------- | ----------------------- | --------------------------------- |
| `file.url`     | `ImageSwatchPillOption` | `h-12` labeled pill (icon + name) |
| hex in `value` | `ColorSwatchOption`     | `h-12` circle                     |

See [variant-selector-ui.md](../references/variant-selector-ui.md) for border/state classes.

## File Structure

```
src/ui/components/pdp/variant-selection/
├── index.ts
├── types.ts
├── utils.ts
├── variant-selector.tsx
├── variant-selection-section.tsx
├── optional-attributes.tsx
└── renderers/
    ├── color-swatch-option.tsx      # Hex swatch circles
    ├── image-swatch-pill-option.tsx # Image swatch pills
    ├── button-option.tsx            # Size/text buttons
    └── index.ts                     # defaultRenderers registry
```

## Key Functions in `utils.ts`

| Function                        | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| `groupVariantsByAttributes()`   | Extract unique attribute values from variants  |
| `findMatchingVariant()`         | Find variant matching ALL selected attributes  |
| `hasCompatibleVariant()`        | Any variant matches partial selections         |
| `getOptionsForAttribute()`      | Options with availability + compatibility info |
| `getAdjustedSelections()`       | Partial accumulation + conflict auto-clear     |
| `getUnavailableAttributeInfo()` | Detect dead-end selections                     |
| `normalizeAttributeValueId()`   | Value name → URL option id                     |

For detailed function signatures, see [../references/variant-utils-reference.md](../references/variant-utils-reference.md).

## Option States

| State            | Meaning                                 | Visual (buttons/pills)      | Clickable?        |
| ---------------- | --------------------------------------- | --------------------------- | ----------------- |
| **Compatible**   | Works with current other selections     | `border-gray-400`           | ✓                 |
| **Selected**     | Currently chosen                        | `border-foreground`, fill   | ✓                 |
| **Incompatible** | No variant with this + other selections | `border-gray-200`, muted    | ✓ (clears others) |
| **Out of stock** | Variant exists but quantity = 0         | strikethrough, `opacity-60` | ✗                 |

Compatibility flag: `existsWithCurrentSelection` from `getOptionsForAttribute()`.

**Do not** use `border-border` for default compatible buttons — too light (see variant-selector-ui.md).

## Partial vs Complete Selection

| Phase                                   | `findMatchingVariant` | `getAdjustedSelections` behavior                            |
| --------------------------------------- | --------------------- | ----------------------------------------------------------- |
| **Partial** (some groups empty)         | `undefined`           | **Keep** new + prior selections if `hasCompatibleVariant()` |
| **Complete** (all groups filled, match) | variant id            | Keep all; set `?variant=`                                   |
| **Complete** (all filled, no match)     | `undefined`           | AUTO_ADJUST: clear to `{ [clickedAttr]: value }` only       |

**Bug to avoid:** Calling `findMatchingVariant()` alone to decide whether to keep partial selections — it always returns `undefined` until every attribute group is filled.

Multi-attribute example (demo audiobooks): Medium + Audio quality + Instant Delivery — user must select all three before add to cart enables.

## URL Parameter Pattern

```
?medium=mp3&audio-quality=standard&instant-delivery=instant-delivery:-yes&variant=abc123
```

The `variant` param is only set when ALL attributes are selected and a match exists.

## Discount Badges

Options can show discount percentages on any renderer (`discountPercent` on `VariantOption`). Badge: small red pill at bottom-right of the option control.

## Examples

### Smart Selection Adjustment (complete selection only)

```
State: ?color=red&size=s (all attrs filled, but user clicks Size L)
Red/L doesn't exist → AUTO_ADJUST → ?size=l (color cleared)
```

### Building partial selection (multi-attribute)

```
1. Click Medium → MP3     → ?medium=mp3
2. Click Standard         → ?medium=mp3&audio-quality=standard  (medium kept!)
3. Click Instant Delivery → complete → ?variant=... added
```

### Custom Renderers

```tsx
<VariantSelectionSection
	variants={variants}
	renderers={{
		color: MyCustomColorPicker,
		size: MySizeChart,
	}}
/>
```

## State Machine

For the full state diagram and transition rules, see [../references/variant-state-machine.md](../references/variant-state-machine.md).

| State        | Add to Cart | Description                    |
| ------------ | ----------- | ------------------------------ |
| **Empty**    | ❌          | No selections                  |
| **Partial**  | ❌          | Some attributes selected       |
| **Complete** | ✅          | All selected, variant found    |
| **Conflict** | —           | All filled, impossible → clear |
| **DeadEnd**  | ❌          | Selection blocks other groups  |

## Testing

```bash
pnpm test src/ui/components/pdp/variant-selection/utils.test.ts
```

Fixture `audiobookVariants` in `__fixtures__/variants.ts` covers 3-attribute partial selection.

## Anti-patterns

❌ **Don't enable "Add to Cart" without full selection** - Needs variant ID  
❌ **Don't block incompatible options** - Let users click, clear others when complete  
❌ **Don't clear partial selections** when `findMatchingVariant` is undefined — use `hasCompatibleVariant`  
❌ **Don't assume single attribute** - Products can have multiple (incl. BOOLEAN selection attrs)  
❌ **Don't use `0` in boolean checks for prices** - Use `typeof === "number"`  
❌ **Don't make non-selection attributes interactive** - They're display-only (badges, not toggles)  
❌ **Don't use `border-border` on compatible button/pill options** - Use `border-gray-400`
