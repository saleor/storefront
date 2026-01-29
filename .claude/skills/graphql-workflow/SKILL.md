---
name: graphql-workflow
description: Modify GraphQL queries and regenerate types. Use when editing .graphql files, adding fields to queries, or seeing TypeScript errors about missing GraphQL types.
---

# GraphQL Workflow

> **Sources**:
>
> - [Saleor API Reference](https://docs.saleor.io/api-reference) - GraphQL schema and field permissions
> - [graphql-codegen](https://the-guild.dev/graphql/codegen) - Type generation

## When to Use

Use this skill when:

- Modifying any `.graphql` file in `src/graphql/` or `src/checkout/graphql/`
- Adding new fields to existing queries
- Creating new queries or mutations
- Seeing TypeScript errors about missing GraphQL types

## Instructions

### 1. Locate the Right File

| Purpose                           | Location                         | Generated Types                   | Regenerate With          |
| --------------------------------- | -------------------------------- | --------------------------------- | ------------------------ |
| Storefront (products, cart, etc.) | `src/graphql/*.graphql`          | `src/gql/`                        | `pnpm generate`          |
| Checkout flow                     | `src/checkout/graphql/*.graphql` | `src/checkout/graphql/generated/` | `pnpm generate:checkout` |

> **Note**: Checkout uses urql (client-side), storefront uses Next.js fetch (server-side). That's why they have separate codegen setups.

### 2. Make Your Changes

Edit the `.graphql` file. Example - adding a field:

```graphql
query ProductDetails($slug: String!, $channel: String!) {
	product(slug: $slug, channel: $channel) {
		id
		name
		newField # Add your field here
	}
}
```

### 3. Regenerate Types (CRITICAL)

```bash
# For storefront queries (src/graphql/*.graphql)
pnpm run generate

# For checkout queries (src/checkout/graphql/*.graphql)
pnpm run generate:checkout
```

This regenerates TypeScript types. **Always run the appropriate command after any GraphQL change.**

- `src/gql/` - Storefront types (DO NOT EDIT)
- `src/checkout/graphql/generated/` - Checkout types (DO NOT EDIT)

### 4. Use the Types

```typescript
import { ProductDetailsDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";

const { product } = await executePublicGraphQL(ProductDetailsDocument, {
	variables: { slug, channel },
	revalidate: 60,
});
// TypeScript now recognizes product.newField
```

## Common Issues

### Permission Errors

If you see:

```
"To access this path, you need one of the following permissions: MANAGE_..."
```

The field requires admin permissions. Use safe patterns:

```graphql
# For variant attributes - use variantSelection argument
attributes(variantSelection: ALL) {
  values { name value }
  attribute { name slug }
}
```

### Nullable Fields

Saleor's schema has many nullable fields. Always use optional chaining:

```typescript
// Good
const name = product.category?.name ?? "Uncategorized";

// Bad - will crash if category is null
const name = product.category.name;
```

## Anti-patterns

❌ **Don't edit generated files** (`src/gql/` or `src/checkout/graphql/generated/`)  
❌ **Don't forget to regenerate types** - Run the appropriate `generate` command  
❌ **Don't assume fields are non-null** - Use optional chaining  
❌ **Don't mix up the two codegen setups** - Storefront ≠ Checkout
