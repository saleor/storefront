# Detect: pdp-swatch-selectors

## Needs migration if

Fork has structured variant selection **and** any of:

```bash
# Missing swatch image renderer
! test -f src/ui/components/pdp/variant-selection/renderers/image-swatch-pill-option.tsx

# Missing partial-selection helpers (multi-attribute bug)
! grep -q "hasCompatibleVariant" src/ui/components/pdp/variant-selection/utils.ts 2>/dev/null

# Missing implicit single-option attribute handling
! grep -q "getImplicitSelections" src/ui/components/pdp/variant-selection/utils.ts 2>/dev/null

# GraphQL missing swatch file URL on variant attributes
! grep -q "file {" src/graphql/VariantDetailsFragment.graphql 2>/dev/null
```

## Already applied if

```bash
test -f src/ui/components/pdp/variant-selection/renderers/image-swatch-pill-option.tsx
grep -q "getImplicitSelections" src/ui/components/pdp/variant-selection/utils.ts
grep -q "hasCompatibleVariant" src/ui/components/pdp/variant-selection/utils.ts
grep -q "getSwatchData" src/lib/colors.ts
grep -q "file {" src/graphql/VariantDetailsFragment.graphql
```

## Skip if

No variant selection module (name-only fallback only):

```bash
test ! -d src/ui/components/pdp/variant-selection && echo "SKIP — no structured variant selection"
```

Or product catalog never uses `inputType: SWATCH` and fork accepts porting only when needed (still recommended — includes selection bugfix).

## False positive

- `getSwatchData` added locally with different name — compare behavior in `utils.ts` `groupVariantsByAttributes`
- Custom image swatch renderer with different filename — check `variant-selector.tsx` routes `swatchImageUrl` to a pill renderer
