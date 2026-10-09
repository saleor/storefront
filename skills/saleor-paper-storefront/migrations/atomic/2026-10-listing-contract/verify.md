# Verify

- `src/config/listing-providers.ts` maps `all`, `category`, `collection`, and `search`.
- `pnpm run verify` passes.
- `pnpm build:check` shows ◐ for products, categories, collections, search, and the product page.
- Category and collection previous-page requests send `$last` and `$before`.
- Every provider in `LISTING_PROVIDER_REGISTRY` has `src/lib/listing/providers/<id>/contract.test.ts`.
- `/search?query=x&page=2` renders the first page on the Saleor provider instead of an error.
