# Testing Strategy & Conventions

The project uses Vitest for unit testing. Test coverage is currently minimal — 2 test files covering pure utility functions. This rule documents the conventions for writing new tests and identifies the highest-value testing targets.

---

## Current State

The project has exactly 2 test files:

| File                                                    | What It Tests                      |
| ------------------------------------------------------- | ---------------------------------- |
| `src/ui/components/pdp/variant-selection/utils.test.ts` | Variant matching & selection logic |
| `src/ui/components/plp/filter-utils.test.ts`            | Filter variable building           |

Both test pure utility functions with fixture data. The patterns in these files are the conventions to follow for new tests.

---

## Configuration

```typescript
// vitest.config.ts
export default defineConfig({
	test: {
		globals: true, // describe, it, expect available globally
		environment: "node", // Node environment (not jsdom)
		include: ["src/**/*.test.ts"],
	},
	resolve: {
		alias: { "@": path.resolve(__dirname, "./src") },
	},
});
```

Run tests:

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
```

---

## Where to Add Tests First

Highest-value testing targets, in priority order:

### 1. Variant selection utilities (existing)

Already tested. The `findMatchingVariant`, `getAdjustedSelections`, and option state functions have the most complex logic in the project. Extend these tests when modifying variant behavior.

### 2. Price formatting and money utilities

Functions that format currency, compare prices, calculate discounts. These affect what customers see and are pure functions — ideal for unit tests.

### 3. Filter/sort logic (existing)

Already tested. `buildFilterVariables` and related functions translate URL params to GraphQL filter inputs. Extend when adding new filter types.

### 4. Checkout utility functions

`src/lib/checkout.ts` — `findOrCreate`, `getIdFromCookies`, cookie management. These are critical path functions where bugs cause cart loss.

### 5. GraphQL error handling helpers

`getUserMessage()`, `asValidationError()` — Functions in `src/lib/graphql.ts` that transform errors into user-facing messages. Pure functions with clear inputs/outputs.

---

## What to Test

### Test: Pure utility functions

These are the primary testing targets — functions that transform data without side effects:

```typescript
// src/ui/components/pdp/variant-selection/utils.test.ts
import { findMatchingVariant, getAdjustedSelections } from "./utils";
import { tshirtVariants, sparseVariants } from "./__fixtures__/variants";

describe("findMatchingVariant", () => {
	it("returns variant ID when all attributes selected", () => {
		const result = findMatchingVariant(tshirtVariants, { color: "black", size: "m" });
		expect(result).toBe("tshirt-black-m");
	});

	it("returns undefined for non-existent combination", () => {
		const result = findMatchingVariant(sparseVariants, { color: "red", size: "m" });
		expect(result).toBeUndefined();
	});
});
```

### Test: Edge cases and boundary conditions

- Empty arrays, null/undefined inputs
- Products with no attributes (fallback behavior)
- $0 prices (not treated as falsy)
- Null quantity (treated as unavailable)

### Don't test:

- **Generated types** (`src/gql/`, `src/checkout/graphql/generated/`) — auto-generated from schema
- **React components directly** — The project uses Node environment, not jsdom
- **Server actions** — These call GraphQL and cookies; test the utilities they use instead
- **Third-party library behavior** — Trust the libraries

---

## Test File Conventions

### Co-located tests

Test files live next to the code they test:

```
src/ui/components/pdp/variant-selection/
├── utils.ts              # Source
├── utils.test.ts         # Tests
└── __fixtures__/
    └── variants.ts       # Test data
```

### Fixture directories

Realistic test data lives in `__fixtures__/` directories:

```typescript
// src/ui/components/pdp/variant-selection/__fixtures__/variants.ts
export const tshirtVariants = [
	{
		id: "tshirt-black-s",
		name: "Black / S",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Black", value: "black" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
	},
	// ... more variants
];
```

---

## Mocking GraphQL Imports

When a test file imports from a module that uses `server-only` or `executePublicGraphQL`, mock the module:

```typescript
import { describe, it, expect, vi } from "vitest";

// Mock BEFORE importing the module under test
vi.mock("@/lib/graphql", () => ({
	executePublicGraphQL: vi.fn(),
}));

// Now import the module that depends on @/lib/graphql
import { buildFilterVariables, extractCategoryOptions } from "./filter-utils";
```

This is needed because:

- `@/lib/graphql` uses `process.env.NEXT_PUBLIC_SALEOR_API_URL` at module scope
- Some modules transitively import `server-only`, which fails in test environment

---

## Test Structure

Follow the project's existing pattern:

```typescript
import { describe, it, expect } from "vitest";
import { functionUnderTest } from "./utils";
import { fixtureData } from "./__fixtures__/data";

describe("functionUnderTest", () => {
	it("handles the happy path", () => {
		const result = functionUnderTest(fixtureData, { validInput: true });
		expect(result).toBe(expectedOutput);
	});

	it("handles edge case", () => {
		const result = functionUnderTest([], {});
		expect(result).toBeUndefined();
	});
});
```

---

## Anti-patterns

- **Don't test generated types** — They come from codegen and are always correct for the schema
- **Don't import `server-only` modules without mocking** — Will throw at import time
- **Don't create test data inline for complex structures** — Use `__fixtures__/` directories
- **Don't test React component rendering** — The test environment is Node, not jsdom
- **Don't test GraphQL execution functions directly** — Mock them and test the logic that uses their results
