# Verify: pdp-swatch-selectors

```bash
pnpm run generate
pnpm exec tsc --noEmit
pnpm test src/ui/components/pdp/variant-selection/utils.test.ts
```

Manual (demo or staging with SWATCH attributes, e.g. audiobook audio-quality):

- [ ] Image swatch attributes render as labeled pills (`h-12`), not broken img icons
- [ ] Hex-only swatches still render as circles
- [ ] Compatible unselected options show darker border (`border-gray-400`), not washed out
- [ ] Multi-attribute product: selecting option in group B does **not** clear group A (partial URL accumulates)
- [ ] All attributes selected → `?variant=` appears and add-to-cart enables
- [ ] Single-option attribute (if present) does not show a pointless 1-button selector; variant still resolves

Record: `2026-06-pdp-swatch-selectors` / `df9dd13b`
