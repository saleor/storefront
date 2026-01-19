---
name: testing
description: Write fast, effective tests with Vitest. Use when adding tests for new features, debugging failing tests, or deciding what to test vs skip.
---

# Testing

> **Source**: [Vitest Docs](https://vitest.dev/) - Test framework documentation

## When to Use

Use this skill when:

- Adding tests for new features
- Debugging failing tests
- Deciding what to test vs skip

## Framework

This project uses **Vitest** (not Jest):

```bash
pnpm test          # Watch mode (fastest iteration)
pnpm test:run      # Single run (CI)
```

## What to Test

| Priority  | What                     | Why                                  |
| --------- | ------------------------ | ------------------------------------ |
| 🔴 High   | Pure utility functions   | Fast, no mocking, high value         |
| 🔴 High   | State machine logic      | Complex transitions, edge cases      |
| 🟡 Medium | Data transformations     | GraphQL → UI mappings                |
| 🟢 Lower  | React components         | Slow, requires DOM, often E2E covers |
| ⚫ Skip   | Third-party integrations | Mock at boundary instead             |

## Developer Habits That Keep Tests Fast

| Practice                            | Why                         |
| ----------------------------------- | --------------------------- |
| Test pure functions, not components | No React rendering overhead |
| Mock network/timers at boundaries   | No waiting for I/O          |
| Small focused fixtures              | Less memory allocation      |
| One assertion per concept           | Faster failure diagnosis    |
| `describe.skip` for slow suites     | Skip during rapid iteration |
| Run filtered tests while coding     | `pnpm test -- functionName` |

## File Structure

```
src/ui/components/pdp/variant-selection/
├── utils.ts                    # Pure functions
├── utils.test.ts               # Tests next to source
└── __fixtures__/
    └── variants.ts             # Shared test data
```

### Fixture Guidelines

```typescript
// ✅ Good: Minimal, focused fixtures
export const tshirtVariants: SaleorVariant[] = [
  { id: "black-s", name: "Black / S", quantityAvailable: 10, ... },
  { id: "black-m", name: "Black / M", quantityAvailable: 10, ... },
];

// ❌ Bad: Copy-pasted production data (100+ variants)
export const allProducts = require("./huge-dump.json");
```

## Speed Commands

```bash
# During development (fastest)
pnpm test -- utils.test.ts           # Single file
pnpm test -- findMatchingVariant     # Pattern match
pnpm test -- -t "sparse"             # Test name filter
pnpm test -- --changed               # Only git-changed files

# CI
pnpm test:run                        # Full suite, single run
```

## Test Patterns

### Testing State Transitions

```typescript
describe("getAdjustedSelections", () => {
	it("clears conflicting selections when variant doesn't exist", () => {
		// State: Blue/L selected
		const current = { color: "blue", size: "l" };

		// Action: Switch to Red (which only has S)
		const result = getAdjustedSelections(variants, current, "color", "red");

		// Result: Size cleared (Red/L doesn't exist)
		expect(result).toEqual({ color: "red" });
	});
});
```

### Testing Edge Cases

```typescript
describe("edge cases", () => {
	it("handles $0 price correctly (not treated as falsy)", () => {
		// 0 is falsy in JS - explicit typeof check needed
		const freeVariant = { pricing: { price: { gross: { amount: 0 } } } };
		expect(variantHasDiscount(freeVariant)).toBe(true);
	});

	it("handles null/undefined gracefully", () => {
		const result = findMatchingVariant([], {});
		expect(result).toBeUndefined();
	});
});
```

## Vitest Config

```typescript
// vitest.config.ts
export default defineConfig({
	test: {
		globals: true,
		environment: "node", // Fastest, no DOM
		include: ["src/**/*.test.ts"],
		testTimeout: 5000, // Fail fast on hangs
	},
	resolve: {
		alias: { "@": path.resolve(__dirname, "./src") },
	},
});
```

## Anti-patterns

❌ **Don't test implementation details** - Test behavior, not internal structure  
❌ **Don't use `sleep()` or real timers** - Use `vi.useFakeTimers()`  
❌ **Don't test third-party code** - Trust libraries, mock at boundaries  
❌ **Don't write slow component tests** - Prefer E2E for UI flows  
❌ **Don't copy production data as fixtures** - Create minimal focused data
