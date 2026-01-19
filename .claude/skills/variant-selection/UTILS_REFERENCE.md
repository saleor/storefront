# Variant Selection Utilities Reference

Detailed reference for functions in `src/ui/components/pdp/variant-selection/utils.ts`.

## Core Functions

### `groupVariantsByAttributes(variants)`

Extracts unique attribute values from all variants.

**Input**: Array of Saleor variants with attributes  
**Output**: Map of attribute slugs to value arrays

```typescript
const groups = groupVariantsByAttributes(variants);
// {
//   color: [{ id: "1", name: "Black", slug: "black" }, ...],
//   size: [{ id: "2", name: "Medium", slug: "m" }, ...]
// }
```

### `findMatchingVariant(variants, selections)`

Finds a variant that matches ALL selected attribute values.

**Input**:

- `variants`: All product variants
- `selections`: `Record<attributeSlug, valueSlug>` (e.g., `{ color: "black", size: "m" }`)

**Output**: Matching variant or `undefined`

```typescript
const variant = findMatchingVariant(variants, { color: "black", size: "m" });
if (variant) {
	// Can add to cart with variant.id
}
```

### `getOptionsForAttribute(variants, attributeSlug, selections)`

Gets options for a single attribute with availability/compatibility info.

**Output**: Array of `VariantOption`:

```typescript
interface VariantOption {
	id: string;
	name: string;
	slug: string;
	available: boolean; // At least one variant in stock
	compatible: boolean; // Works with current selections
	hasDiscount?: boolean; // Any variant with this option is discounted
	discountPercent?: number; // Max discount percentage
}
```

### `getAdjustedSelections(variants, currentSelections, attributeSlug, value)`

Returns new selections after user picks an option, auto-clearing conflicts.

**Logic**:

1. Add new selection to current selections
2. If valid variant exists → return updated selections
3. If no valid variant → return only the new selection (clear others)

See [STATE_MACHINE.md](STATE_MACHINE.md) for transition details.

### `getUnavailableAttributeInfo(variants, groups, selections)`

Detects "dead end" selections where an attribute group has no valid options.

**Output**: `{ slug, name, blockedBy }` or `null`

```typescript
const deadEnd = getUnavailableAttributeInfo(variants, groups, { color: "red" });
if (deadEnd) {
	// Show: "No {deadEnd.name} available in {deadEnd.blockedBy}"
}
```

## Discount Detection

### How Discounts Are Detected

A variant has a discount when `undiscountedPrice > price`:

```typescript
const hasDiscount = variant.pricing?.priceUndiscounted?.gross?.amount > variant.pricing?.price?.gross?.amount;
```

### Discount Percentage Calculation

```typescript
const discountPercent = Math.round(((undiscounted - price) / undiscounted) * 100);
```

### Option-Level Discount Aggregation

When building options, we aggregate discounts across all variants with that option:

```typescript
// For color "Black", check all Black variants
// hasDiscount = true if ANY Black variant is discounted
// discountPercent = MAX discount among Black variants
```

## Type Definitions

See `src/ui/components/pdp/variant-selection/types.ts`:

```typescript
export interface VariantOption {
	id: string;
	name: string;
	slug: string;
	available: boolean;
	compatible: boolean;
	hasDiscount?: boolean;
	discountPercent?: number;
}

export interface AttributeGroup {
	slug: string;
	name: string;
	values: VariantOption[];
}

export type Selections = Record<string, string>;
```
