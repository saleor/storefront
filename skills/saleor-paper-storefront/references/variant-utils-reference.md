# Variant Selection Utilities Reference

Detailed reference for functions in `src/ui/components/pdp/variant-selection/utils.ts`.

## Core Functions

### `normalizeAttributeValueId(name)`

Converts Saleor value display name to URL option id:

```typescript
normalizeAttributeValueId("Hi-Res 24-bit"); // "hi-res-24-bit"
normalizeAttributeValueId("Instant Delivery: Yes"); // "instant-delivery:-yes"
```

### `variantMatchesSelections(variant, selections)`

True when variant matches every key in `selections`.

### `hasCompatibleVariant(variants, selections)`

True when at least one variant satisfies all current selections. Used for **partial** selection — does not require all attribute groups to be filled.

### `groupVariantsByAttributes(variants)`

Extracts unique attribute values from all variants. Populates `colorHex` / `swatchImageUrl` on options when `inputType: SWATCH` or color slug (see `src/lib/colors.ts`).

### `findMatchingVariant(variants, selections)`

Finds a variant matching ALL selected attribute values.

**Returns `undefined` when:**

- No selections
- **Partial selections** (not every attribute group has a value)
- Complete selections with no matching variant

```typescript
const variant = findMatchingVariant(variants, {
	medium: "mp3",
	"audio-quality": "standard",
	"instant-delivery": "instant-delivery:-yes",
});
```

### `getOptionsForAttribute(variants, attributeGroups, selections, attributeSlug)`

Gets options for one attribute with availability and compatibility:

```typescript
interface VariantOption {
	id: string;
	name: string;
	available: boolean;
	existsWithCurrentSelection?: boolean; // false = incompatible with other picks
	colorHex?: string;
	swatchImageUrl?: string;
	hasDiscount?: boolean;
	discountPercent?: number;
}
```

`existsWithCurrentSelection: false` drives **incompatible** UI (`border-gray-200`, muted). See [variant-selector-ui.md](variant-selector-ui.md).

### `getAdjustedSelections(variants, currentSelections, attributeSlug, value)`

Returns new selections after user picks an option.

**Logic:**

1. Merge new value into current selections
2. If `findMatchingVariant` succeeds → return merged (complete match)
3. If **not all** groups filled and `hasCompatibleVariant` → return merged (partial accumulate)
4. Else → return only `{ [attributeSlug]: value }` (clear conflicts)

See [variant-state-machine.md](variant-state-machine.md).

### `getUnavailableAttributeInfo(variants, groups, selections)`

Detects dead-end selections. Output: `{ slug, name, blockedBy }` or `null`.

## Swatch helpers (`src/lib/colors.ts`)

| Function                                        | Purpose                                              |
| ----------------------------------------------- | ---------------------------------------------------- |
| `getSwatchData(value)`                          | `{ colorHex?, imageUrl? }` from `value` + `file.url` |
| `isSwatchInputType(inputType)`                  | `inputType === "SWATCH"`                             |
| `shouldRenderAsSwatch(inputType, slug, swatch)` | Whether to attach swatch fields to option            |

## Discount Detection

A variant has a discount when `priceUndiscounted.gross.amount > price.gross.amount`.

Option-level: aggregate across all variants with that option value (`hasDiscount`, max `discountPercent`).

## Type Definitions

See `src/ui/components/pdp/variant-selection/types.ts`:

```typescript
export interface VariantOption {
	id: string;
	name: string;
	available: boolean;
	existsWithCurrentSelection?: boolean;
	colorHex?: string;
	swatchImageUrl?: string;
	hasDiscount?: boolean;
	discountPercent?: number;
}

export interface AttributeGroup {
	slug: string;
	name: string;
	options: VariantOption[];
}
```

## Tests

```bash
pnpm test src/ui/components/pdp/variant-selection/utils.test.ts
```

`audiobookVariants` fixture — 3 selection attributes, partial selection tests.
