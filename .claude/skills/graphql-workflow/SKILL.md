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

- **Storefront queries**: `src/graphql/*.graphql`
- **Checkout queries**: `src/checkout/graphql/*.graphql`
- **Generated types** (DO NOT EDIT): `src/gql/`

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
pnpm run generate
```

This regenerates `src/gql/` with updated TypeScript types. **Always run this after any GraphQL change.**

### 4. Use the Types

```typescript
import { ProductDetailsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const { product } = await executeGraphQL(ProductDetailsDocument, {
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

❌ **Don't edit files in `src/gql/`** - They're auto-generated  
❌ **Don't forget to run `pnpm run generate`** - Types won't update  
❌ **Don't assume fields are non-null** - Use optional chaining
