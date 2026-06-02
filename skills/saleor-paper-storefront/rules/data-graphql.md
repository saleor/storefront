# Data GraphQL

Modifying GraphQL queries and regenerating types correctly ensures type safety, avoids permission errors, and keeps storefront and checkout data in sync with the Saleor schema. The execution layer in `src/lib/graphql.ts` provides typed error handling, rate limiting, and retry logic.

> **Sources**:
>
> - [Saleor API Reference](https://docs.saleor.io/api-reference) - GraphQL schema and field permissions
> - [graphql-codegen](https://the-guild.dev/graphql/codegen) - Type generation

---

## File Locations

| Purpose                           | Location                         | Generated Types                   | Regenerate With          |
| --------------------------------- | -------------------------------- | --------------------------------- | ------------------------ |
| Storefront (products, cart, etc.) | `src/graphql/*.graphql`          | `src/gql/`                        | `pnpm generate`          |
| Checkout flow                     | `src/checkout/graphql/*.graphql` | `src/checkout/graphql/generated/` | `pnpm generate:checkout` |
| GraphQL execution & types         | `src/lib/graphql.ts`             | N/A (hand-written)                | N/A                      |
| Fetch retry (urql client)         | `src/lib/fetch-retry.ts`         | N/A                               | N/A                      |

> **Note**: Checkout uses urql (client-side), storefront uses Next.js fetch (server-side). That's why they have separate codegen setups.

---

## Making Changes

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

---

## Regenerating Types (CRITICAL)

```bash
# For storefront queries (src/graphql/*.graphql)
pnpm run generate

# For checkout queries (src/checkout/graphql/*.graphql)
pnpm run generate:checkout
```

This regenerates TypeScript types. **Always run the appropriate command after any GraphQL change.**

- `src/gql/` - Storefront types (DO NOT EDIT)
- `src/checkout/graphql/generated/` - Checkout types (DO NOT EDIT)

---

## Execution Functions — Decision Tree

The project provides three execution functions. Choose based on context:

```
Need to run a GraphQL operation?
├─ Is this a server component or server action?
│   ├─ Does it need user authentication (checkout, orders, profile)?
│   │   └─ executeAuthenticatedGraphQL()
│   └─ Is it public data (products, categories, menus)?
│       └─ executePublicGraphQL()
└─ Is this an API route (src/app/api/)?
    └─ executeRawGraphQL()
```

### `executePublicGraphQL` — Public data, no auth

```typescript
import { ProductDetailsDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";

const result = await executePublicGraphQL(ProductDetailsDocument, {
	variables: { slug, channel },
	revalidate: 60,
});

if (!result.ok) {
	// Handle error — see data-error-handling rule
	throw new Error(result.error.message);
}

const { product } = result.data;
```

Use for: product listings, product details, categories, collections, menus, search.

### `executeAuthenticatedGraphQL` — User-scoped data, with auth

```typescript
import { CurrentUserDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";

const result = await executeAuthenticatedGraphQL(CurrentUserDocument, {
	cache: "no-cache",
});

if (!result.ok) {
	// Auth failed or user not logged in — handle gracefully
	return null;
}

const { me } = result.data;
```

Use for: current user queries, orders, addresses, checkout mutations (add to cart, update lines).

**Auth fallback behavior**: If the server-side auth client throws a `DYNAMIC_SERVER_USAGE` error (e.g., during static generation when `cookies()` isn't available), it automatically falls back to an unauthenticated fetch. This prevents build failures for pages that may or may not have a logged-in user.

### `executeRawGraphQL` — API routes without codegen

```typescript
import { executeRawGraphQL, asValidationError, getUserMessage } from "@/lib/graphql";

const result = await executeRawGraphQL<AccountRegisterResult>({
	query: REGISTER_MUTATION,
	variables: { input: { email, password, channel, redirectUrl } },
});

if (!result.ok) {
	return NextResponse.json(
		{ errors: [{ message: getUserMessage(result.error) }] },
		{ status: result.error.type === "network" ? 503 : 400 },
	);
}

// Check Saleor domain validation errors
const { accountRegister } = result.data;
if (accountRegister?.errors?.length) {
	const validationResult = asValidationError(accountRegister.errors);
	return NextResponse.json({ errors: validationResult.error.validationErrors }, { status: 400 });
}
```

Use for: auth API routes (`/api/auth/register`, `/api/auth/reset-password`, `/api/auth/set-password`) where inline GraphQL strings are used instead of codegen documents.

---

## GraphQLResult<T> — Typed Error Handling

All execution functions return `GraphQLResult<T>`, never throw. Always check `result.ok` before accessing data.

```typescript
type GraphQLResult<T> = GraphQLSuccess<T> | GraphQLFailure;

interface GraphQLSuccess<T> {
	ok: true;
	data: T;
}
interface GraphQLFailure {
	ok: false;
	error: GraphQLError;
}
```

The 4 error types (in order of occurrence):

| Type         | Meaning                            | `isRetryable`   | Example                          |
| ------------ | ---------------------------------- | --------------- | -------------------------------- |
| `network`    | Failed to reach server             | `true`          | Timeout, DNS, connection refused |
| `http`       | Server responded with error status | 5xx/429: `true` | HTTP 500, HTTP 429               |
| `graphql`    | Query syntax or validation errors  | `false`         | Unknown field, type mismatch     |
| `validation` | Saleor domain errors               | `false`         | "Email already exists"           |

Helper functions:

- `getUserMessage(error)` — Returns a user-friendly string for each error type
- `asValidationError(errors)` — Converts Saleor mutation `errors[]` into a `GraphQLFailure` with structured `validationErrors`

> **Full error handling patterns**: See `data-error-handling` rule

---

## Request Queue & Rate Limiting

All typed execution functions (`executePublicGraphQL`, `executeAuthenticatedGraphQL`) are automatically queued through a `RequestQueue`:

- **Max concurrent requests**: 3 (configurable via `SALEOR_MAX_CONCURRENT_REQUESTS`)
- **Min delay between requests**: 200ms (configurable via `SALEOR_MIN_REQUEST_DELAY_MS`)
- **Retry**: Exponential backoff on network errors, timeouts, HTTP 429/5xx
- **Timeout**: 15s per request (configurable via `SALEOR_REQUEST_TIMEOUT_MS`)
- **Build retries**: Override retry count with `NEXT_BUILD_RETRIES` env var

The retry logic respects `Retry-After` headers from Saleor's rate limiter.

> **Note**: `executeRawGraphQL` does NOT use the request queue — it's designed for API routes where the queue overhead isn't needed.

---

## Mutation Authoring Patterns

### Checkout mutations (codegen)

Checkout mutations live in `src/checkout/graphql/*.graphql` and always include an `errors` block:

```graphql
mutation transactionInitialize(
	$checkoutId: ID!
	$action: TransactionFlowStrategyEnum
	$paymentGateway: PaymentGatewayToInitialize!
	$amount: PositiveDecimal
) {
	transactionInitialize(id: $checkoutId, action: $action, paymentGateway: $paymentGateway, amount: $amount) {
		transaction {
			id
			actions
		}
		transactionEvent {
			message
			type
		}
		data
		errors {
			field
			code
			message
		}
	}
}
```

### API route mutations (raw)

API route mutations use inline strings with `executeRawGraphQL`:

```typescript
const REGISTER_MUTATION = `
  mutation AccountRegister($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      user { id email }
      errors { field message code }
    }
  }
`;
```

**Always include `errors { field message code }` in every mutation** — this is how Saleor reports domain validation errors (as opposed to GraphQL-level errors).

---

## Server Actions with GraphQL

Server Actions are the mutation layer for the storefront. They compose `executeAuthenticatedGraphQL` or `executePublicGraphQL` with cache revalidation.

### Where Actions Live

| Pattern                    | Location                                                                | When to Use                                                        |
| -------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Inline in Server Component | Same file as page/component                                             | One-off actions tied to a specific page (e.g., add-to-cart on PDP) |
| Separate `actions.ts` file | Co-located with page (e.g., `src/app/[channel]/(main)/cart/actions.ts`) | Shared across components or reused                                 |
| Root actions               | `src/app/actions.ts`                                                    | App-wide actions (e.g., logout)                                    |

### Standard Pattern

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import { SomeMutationDocument } from "@/gql/graphql";

export async function myAction(input: MyInput) {
	const result = await executeAuthenticatedGraphQL(SomeMutationDocument, {
		variables: { ...input },
		cache: "no-cache", // Always no-cache for mutations
	});

	if (!result.ok) {
		console.error("Action failed:", result.error.message);
		return; // Return nothing — UI updates via revalidation
	}

	revalidatePath("/affected-page");
}
```

Key conventions:

- Always pass `cache: "no-cache"` for mutations
- Check `result.ok` before accessing data
- Call `revalidatePath()` after successful mutations to sync cache
- Log errors server-side; return silently (UI updates via revalidation)
- Use `executeAuthenticatedGraphQL` for user-scoped mutations (cart, checkout, orders)

### Inline Server Action (in Server Component)

```typescript
// src/ui/components/pdp/variant-section-dynamic.tsx
export async function VariantSectionDynamic({ product, channel }: Props) {
	async function addToCart() {
		"use server";

		const checkout = await Checkout.findOrCreate({
			checkoutId: await Checkout.getIdFromCookies(channel),
			channel,
		});
		if (!checkout) {
			console.error("Add to cart: Failed to create checkout");
			return;
		}

		const result = await executeAuthenticatedGraphQL(CheckoutAddLineDocument, {
			variables: { id: checkout.id, productVariantId: selectedVariantID },
			cache: "no-cache",
		});

		if (!result.ok) {
			console.error("Add to cart failed:", result.error.message);
			return;
		}

		revalidatePath("/cart");
	}

	return <form action={addToCart}>...</form>;
}
```

### Calling Server Actions from Client Components

```typescript
// Pattern 1: Form action (simplest)
<form action={serverAction}>
	<button type="submit">Submit</button>
</form>

// Pattern 2: useTransition for loading state
"use client";
import { useTransition } from "react";
import { deleteCartLine } from "./actions";

function DeleteButton({ checkoutId, lineId }: Props) {
	const [isPending, startTransition] = useTransition();

	return (
		<button
			onClick={() => startTransition(() => deleteCartLine(checkoutId, lineId))}
			aria-disabled={isPending}
		>
			{isPending ? "Removing..." : "Remove"}
		</button>
	);
}
```

### Revalidation After Mutations

```typescript
import { revalidatePath } from "next/cache";

// Revalidate specific pages affected by the mutation
revalidatePath("/cart"); // After cart modifications
revalidatePath("/"); // After changes that affect home page (cart badge count)
```

The webhook handler (`src/app/api/revalidate/`) also uses tag-based revalidation (`revalidateTag`) for Saleor-triggered cache invalidation — see `data-caching` rule.

---

## Checking the Saleor Schema

To confirm field names, types, nullability, or enum values, search the generated types file:

```bash
# Full schema types, generated from your running Saleor instance
grep -A 20 "^export type Product " src/gql/graphql.ts

# Check an enum
grep -A 10 "^export enum StockAvailability" src/gql/graphql.ts

# Check an input type
grep -A 30 "^export type ProductFilterInput" src/gql/graphql.ts
```

This file is generated by `pnpm generate` via API introspection, so it always matches your exact Saleor version. It contains the **full schema** (all types, enums, inputs), not just the ones used in declared queries.

## Common Issues

### Permission Errors

If you see:

```
"To access this path, you need one of the following permissions: MANAGE_..."
```

The field requires admin permissions and isn't available to anonymous/customer tokens. Either remove it from the storefront query, or fetch it server-side with `SALEOR_APP_TOKEN` and the required permission.

### Nullable Fields

Saleor's schema has many nullable fields. Handle nulls intentionally -- use optional chaining with a fallback for display values, but guard or throw when null signals a real problem:

```typescript
// Display value with fallback
const name = product.category?.name ?? "Uncategorized";

// Guard when null means something is wrong
if (!product.defaultVariant) {
	throw new Error(`Product ${product.slug} has no default variant`);
}
```

### DYNAMIC_SERVER_USAGE During Build

If you see `DYNAMIC_SERVER_USAGE` errors during `next build`, it means a page using `executeAuthenticatedGraphQL` is being statically generated. The auth client calls `cookies()`, which requires dynamic rendering. The execution layer handles this automatically by falling back to unauthenticated fetch, but if you need auth data, ensure the page uses `export const dynamic = "force-dynamic"`.

---

## Anti-patterns

- **Don't edit generated files** (`src/gql/` or `src/checkout/graphql/generated/`)
- **Don't forget to regenerate types** - Run the appropriate `generate` command
- **Don't assume fields are non-null** - Check generated types and handle nulls explicitly
- **Don't mix up the two codegen setups** - Storefront ≠ Checkout
- **Don't destructure result directly** - Always check `result.ok` first: `if (!result.ok) { ... }`
- **Don't omit `errors { field message code }` from mutations** - This is how Saleor reports domain errors
- **Don't retry validation errors** - They are `isRetryable: false` by design
