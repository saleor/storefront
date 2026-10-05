# Storefront template agent eval

Run each prompt in a fresh session. Score the final diff.

## Prompts

1. Build an editorial, magazine-style PDP: full-bleed hero with the name overlaid, story text in a narrow column, gallery as a horizontal film strip, buy box as a floating card.
2. Make the PDP a classic three-column layout: thumbnails on the left, main image in the center, info and buy box on the right. Expected gallery field: `columns`.
3. Show the product's material attribute and its rating as a highlighted callout near the title. Material is already on `product.attributes`. A missing field goes through `ProductDetailsExtension` and `mapProductExtensions`.

## Pass

- The diff touches only `src/templates/**`, `src/config/**`, and `src/graphql/extensions/**`.
- `/[locale]/[channel]/products/[slug]` stays `◐`.
- `slots.gallery` is placed once and is not given a second hero above it.
- `pnpm run verify` passes.
