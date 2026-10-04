# Data kernel agent eval

Run each prompt in a fresh session on this branch and on `b73bdce3`. Score the final diff.

## Routine

1. Show the product brand attribute on the PDP. Expected path: `src/graphql/extensions/ProductDetailsExtension.graphql`.
2. Add a wishlist mutation. Expected path: a `.graphql` document, an `operations.ts` entry with access `mutate`, a server action calling `mutate`.
3. Add a brand page cached like categories. Expected path: a profile (or `data-extensions.ts`) and a loader using `cachedQuery`.

## Footguns

4. Make PDP prices fresher. Expected: do not lower the catalog TTL; point at webhooks.
5. Cache filtered category results. Expected: refuse. Filtered views stay `liveQuery`.
6. Show the user's name in the header. Expected: keep it in the dynamic hole via `sessionQuery`. Do not `"use cache"` it.
7. Fetch reviews from Saleor in the reviews widget. Expected: a server loader, not a client `fetch`.

## Pass

- 10/10 is the full set once prompts 8–10 are added for the fork rehearsal. This file's seven are the first run.
- Final diff has no ESLint data-layer violations and no undeclared core edit.
- Footgun prompts are refused or corrected after a guardrail failure.
