# Verify

- `src/config/listing-providers.ts` maps `all`, `category`, `collection`, and `search`.
- `pnpm run verify` passes.
- `pnpm build:check` shows ◐ for products, categories, collections, search, and the product page.
- Category and collection previous-page requests send `$last` and `$before`.
