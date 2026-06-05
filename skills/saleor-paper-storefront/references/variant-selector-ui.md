# Variant Selector UI & Renderer Patterns

> **When to read:** Before changing `src/ui/components/pdp/variant-selection/` renderers,
> option borders/states, or swatch attribute handling on the PDP.

## Renderer Routing

`VariantSelector` picks a renderer per option (`variant-selector.tsx`):

| Condition                   | Renderer       | Component                              |
| --------------------------- | -------------- | -------------------------------------- |
| `option.swatchImageUrl`     | `_imageSwatch` | `ImageSwatchPillOption` — labeled pill |
| `option.colorHex`           | `_color`       | `ColorSwatchOption` — circular fill    |
| `attributeSlug` in registry | slug key       | e.g. `size` → `SizeButtonOption`       |
| fallback                    | `_default`     | `TextOption` / `ButtonOption`          |

Registry: `renderers/index.ts`. Override per attribute via `VariantSelectionSection` `renderers` prop.

### Saleor Swatch attributes (`inputType: SWATCH`)

GraphQL must fetch swatch data on variant attribute values:

```graphql
selectionAttributes: attributes(variantSelection: VARIANT_SELECTION) {
  attribute { slug name inputType }
  values {
    name
    value          # hex color when set
    file { url }   # image when set
  }
}
```

Data extraction (`src/lib/colors.ts` + `utils.ts`):

- `getSwatchData()` → `{ colorHex?, imageUrl? }`
- `shouldRenderAsSwatch()` → true for `inputType === SWATCH`, color slugs, or when hex/image present
- Options get `colorHex` and/or `swatchImageUrl` on `VariantOption`

**Renderer choice:**

- **Image only** (or image + hex): `ImageSwatchPillOption` — `h-12` pill, thumbnail + label
- **Hex only** (typical color): `ColorSwatchOption` — `h-12` circle

## Option Visual States (CRITICAL)

All button-style renderers (`ButtonOption`, `ImageSwatchPillOption`) share the same
border semantics. Color circles use rings instead of borders.

| State            | Data flag                              | Border / ring                                | Text              | Clickable?        |
| ---------------- | -------------------------------------- | -------------------------------------------- | ----------------- | ----------------- |
| **Selected**     | `isSelected`                           | `border-foreground` + inverted fill          | `text-background` | ✓                 |
| **Compatible**   | `existsWithCurrentSelection !== false` | **`border-gray-400`**                        | `text-foreground` | ✓                 |
| **Incompatible** | `existsWithCurrentSelection === false` | `border-gray-200`, muted text                | dimmed            | ✓ (clears others) |
| **Out of stock** | `!available`                           | same as above + `line-through`, `opacity-60` | —                 | ✗                 |

`existsWithCurrentSelection` comes from `getOptionsForAttribute()` — it checks whether
**any variant** matches this option **plus current selections in other groups**.

### Common mistake

Using `border-border` for the default compatible state. That token is too light and
makes options look disabled. **Always use `border-gray-400`** for compatible unselected
buttons/pills (see `button-option.tsx`, `image-swatch-pill-option.tsx`).

### Color swatch circles

`ColorSwatchOption` uses rings, not rectangular borders:

| State        | Classes                                          |
| ------------ | ------------------------------------------------ |
| Selected     | `ring-2 ring-foreground ring-offset-[3px]`       |
| Default      | `ring-1 ring-border`, hover `ring-foreground/50` |
| Incompatible | `opacity-50` on top of default ring              |
| Out of stock | diagonal strikethrough, `cursor-not-allowed`     |

## Sizing

Keep all interactive selectors **`h-12`** (48px) for alignment across attribute groups:

| Renderer                | Size                                               |
| ----------------------- | -------------------------------------------------- |
| `ButtonOption`          | `h-12`, `min-w` via prop (default `3.5rem`)        |
| `ImageSwatchPillOption` | `h-12` pill, `h-10 w-10` thumbnail, `h-5 w-5` icon |
| `ColorSwatchOption`     | `h-12 w-12` circle                                 |

Row gap in `VariantSelector`: `gap-4` between options.

## Image swatch pills

`ImageSwatchPillOption` layout:

```
┌──────────────────────────────────┐
│ ( ○ icon )  Standard      -30% │  ← rounded-full pill, h-12
└──────────────────────────────────┘
```

- Thumbnail: centered `object-contain` icon in `bg-muted/50` circle
- Selected: pill inverts; icon uses `brightness-0 invert` for contrast on dark fill
- Discount badge: same pill badge as `ButtonOption` (`-N%`, bottom-right)

## Partial multi-attribute selection (logic ↔ UI)

Products can have **3+** `VARIANT_SELECTION` attributes (e.g. Medium + Audio quality + Instant Delivery).

**`getAdjustedSelections()` rules:**

1. If `findMatchingVariant()` succeeds → keep all selections (complete)
2. If **not all** attribute groups filled → keep selections when `hasCompatibleVariant()` is true
3. If **all** groups filled but no variant → AUTO_ADJUST: `{ [newAttr]: newValue }` only

**Anti-pattern:** Treating incomplete selection as conflict. `findMatchingVariant()` returns
`undefined` until every group has a value — that must **not** clear other groups.

See [variant-state-machine.md](variant-state-machine.md) and tests in `utils.test.ts` (`audiobookVariants` fixture).

## URL & option IDs

Option IDs = `normalizeAttributeValueId(name)`:

```typescript
"Hi-Res 24-bit" → "hi-res-24-bit"
"Instant Delivery: Yes" → "instant-delivery:-yes"  // colon preserved
```

URL params use attribute **slug** as key and option **id** as value:

```
?medium=mp3&audio-quality=standard&instant-delivery=instant-delivery:-yes&variant=...
```

`variant` param is set only when all groups are selected and a match exists.

## Tests

```bash
pnpm test src/ui/components/pdp/variant-selection/utils.test.ts
```

Key fixtures: `__fixtures__/variants.ts` (`audiobookVariants` for 3-attribute matrix).

## Files

| File                                     | Purpose                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| `variant-selector.tsx`                   | Per-attribute group, renderer routing                                     |
| `variant-selection-section.tsx`          | URL state, optimistic UI, `handleSelect`                                  |
| `renderers/button-option.tsx`            | Size/text pills — border reference implementation                         |
| `renderers/color-swatch-option.tsx`      | Hex swatch circles                                                        |
| `renderers/image-swatch-pill-option.tsx` | Image swatch labeled pills                                                |
| `utils.ts`                               | `getAdjustedSelections`, `hasCompatibleVariant`, `getOptionsForAttribute` |
| `src/lib/colors.ts`                      | `getSwatchData`, `isSwatchInputType`                                      |

## Anti-patterns

❌ **Don't use `border-border` for compatible button/pill options** — use `border-gray-400`  
❌ **Don't clear partial selections when `findMatchingVariant` is undefined** — check `hasCompatibleVariant`  
❌ **Don't assume swatch = color slug only** — use `inputType: SWATCH` and `swatchImageUrl`  
❌ **Don't skip `file { url }` in GraphQL** — image swatches won't render  
❌ **Don't use different heights** across renderers on the same PDP — keep `h-12`
