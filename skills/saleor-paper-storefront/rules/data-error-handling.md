# Data Error Handling

Consistent, layered error handling prevents raw GraphQL errors from reaching users, ensures retryable failures are retried, and gives developers structured information for debugging. All GraphQL execution functions return `GraphQLResult<T>` — never throw.

> **Key file**: `src/lib/graphql.ts` — All types, helpers, and execution functions

---

## The 4 Error Layers

Errors occur in a strict order. Later layers only happen if earlier ones succeeded:

```
1. network  →  2. http  →  3. graphql  →  4. validation
   (fetch)      (status)    (GQL errors)   (domain errors)
```

| Layer        | When                                       | `isRetryable` | User Message                              |
| ------------ | ------------------------------------------ | ------------- | ----------------------------------------- |
| `network`    | Can't reach server (timeout, DNS, offline) | `true`        | "Unable to connect to the store..."       |
| `http`       | Server responded with 4xx/5xx              | 5xx/429 only  | Varies by status code                     |
| `graphql`    | Query syntax/validation errors in response | `false`       | "Something went wrong loading this page." |
| `validation` | Saleor domain errors (e.g. "email exists") | `false`       | The actual error message from Saleor      |

---

## Server-Side: GraphQLResult<T> Pattern

All three execution functions return `GraphQLResult<T>`:

```typescript
const result = await executePublicGraphQL(ProductDetailsDocument, {
	variables: { slug, channel },
});

// ALWAYS check result.ok first
if (!result.ok) {
	// result.error has: type, message, isRetryable, statusCode?, validationErrors?
	console.error(`GraphQL error (${result.error.type}):`, result.error.message);
	return null;
}

// Safe to access data
const { product } = result.data;
```

### User-Facing Error Messages

Use `getUserMessage()` to convert technical errors into user-friendly text:

```typescript
import { getUserMessage } from "@/lib/graphql";

if (!result.ok) {
	const userMessage = getUserMessage(result.error);
	// Returns contextual messages like:
	// network  → "Unable to connect to the store. Please check your internet connection."
	// http 401 → "You don't have permission to view this content."
	// http 5xx → "The store is temporarily unavailable. Please try again in a moment."
	// graphql  → "Something went wrong loading this page."
	// validation → The actual error message (e.g. "Email already registered")
}
```

### Handling Saleor Validation Errors

Saleor mutations return domain errors in the response `errors[]` field (not as GraphQL errors). Use `asValidationError()` to convert them:

```typescript
import { executeRawGraphQL, asValidationError, getUserMessage } from "@/lib/graphql";

const result = await executeRawGraphQL<AccountRegisterResult>({
	query: REGISTER_MUTATION,
	variables: { input: { email, password } },
});

// Step 1: Check for transport/GraphQL errors
if (!result.ok) {
	return NextResponse.json(
		{ errors: [{ message: getUserMessage(result.error) }] },
		{ status: result.error.type === "network" ? 503 : 400 },
	);
}

// Step 2: Check for Saleor domain validation errors
const { accountRegister } = result.data;
if (accountRegister?.errors?.length) {
	const validationResult = asValidationError(accountRegister.errors);
	// validationResult.error.validationErrors is a structured array:
	// [{ field: "email", message: "This email is already registered", code: "UNIQUE" }]
	return NextResponse.json({ errors: validationResult.error.validationErrors }, { status: 400 });
}
```

---

## Client-Side: Checkout Error Handling (urql)

The checkout flow uses urql (client-side) with a different error extraction pattern:

### `extractMutationErrors` — urql mutation results

From `saleor-storefront/src/checkout/hooks/useSubmit/utils.ts`:

```typescript
const { hasErrors, apiErrors, graphqlErrors } = extractMutationErrors<FormData, typeof mutation>(result);

if (hasErrors) {
	// apiErrors: Saleor domain errors from mutation.errors[]
	// graphqlErrors: CombinedError from urql (network/schema errors)
}
```

### `useErrorMessages` — Error code to message mapping

From `saleor-storefront/src/checkout/hooks/useErrorMessages/useErrorMessages.ts`:

Maps Saleor error codes to user-friendly strings:

| Error Code                 | Message                                       |
| -------------------------- | --------------------------------------------- |
| `invalid`                  | "Invalid value"                               |
| `required`                 | "Required field"                              |
| `passwordTooShort`         | "Password must be at least 8 characters."     |
| `insufficientStock`        | "Not enough of chosen item in stock."         |
| `invalidCredentials`       | "Invalid credentials provided at login."      |
| `quantityGreaterThanLimit` | "Chosen quantity is more than limit allowed." |

---

## Error Handling by Context

| Context                 | Function                      | Error Handling                               |
| ----------------------- | ----------------------------- | -------------------------------------------- |
| Server component        | `executePublicGraphQL`        | Check `result.ok`, show fallback UI          |
| Server action (cart)    | `executeAuthenticatedGraphQL` | Check `result.ok`, return error to client    |
| API route (auth)        | `executeRawGraphQL`           | Check `result.ok` + mutation `errors[]`      |
| Checkout (urql, client) | urql `useMutation`            | `extractMutationErrors` + `useErrorMessages` |

---

## Legacy Exports

```typescript
/** @deprecated Use Result pattern instead */
export class SaleorError extends Error { ... }
```

The `SaleorError` class is kept for gradual migration from throw-based to Result-based error handling. New code should use `GraphQLResult<T>`.

---

## Anti-patterns

- **Don't destructure result without checking `ok`** — `const { data } = await execute(...)` will crash on errors
- **Don't show raw GraphQL errors to users** — Use `getUserMessage()` for user-facing text
- **Don't retry validation errors** — They are `isRetryable: false`; the user must fix their input
- **Don't swallow errors silently** — Always log or surface them. A bare `catch {}` hides bugs
- **Don't check for errors inconsistently** — Every call site should handle both transport errors (`!result.ok`) and mutation validation errors (`data.mutationName.errors[]`)
- **Don't expose Saleor internals in API responses** — Log error details server-side, return `getUserMessage()` to the client
