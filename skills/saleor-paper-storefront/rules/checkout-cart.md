# Cart Management

Cart operations use Saleor's checkout line mutations through Server Actions. The cart is a full page (not a drawer), state is stored in HTTP-only cookies, and cache invalidation uses `revalidatePath`. Understanding this flow prevents stale cart data, lost checkouts, and broken add-to-cart behavior.

---

## Architecture Overview

```
User clicks "Add to Cart"
    │
    ▼
Server Action (addToCart)
    ├── Checkout.findOrCreate() ─── Cookie: checkoutId-{channel}
    ├── executeAuthenticatedGraphQL(CheckoutAddLineDocument)
    └── revalidatePath("/cart")
            │
            ▼
    Cart page re-renders with updated data
```

No client-side state management. No cart context or provider. Each page fetches cart data server-side from the checkout cookie.

---

## Key Files

| File                                                | Purpose                                                                     |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| `src/lib/checkout.ts`                               | `findOrCreate`, `find`, `create`, `getIdFromCookies`, `clearCheckoutCookie` |
| `src/ui/components/pdp/variant-section-dynamic.tsx` | Inline `addToCart` server action                                            |
| `src/ui/components/cart/actions.ts`                 | `deleteCartLine`, `updateCartLineQuantity` server actions                   |
| `src/ui/components/cart/cart-drawer.tsx`            | Cart UI with quantity controls (Client Component)                           |
| `src/app/[channel]/(main)/cart/page.tsx`            | Cart page (Server Component)                                                |
| `src/ui/components/nav/components/CartNavItem.tsx`  | Cart badge in header (Server Component)                                     |
| `src/graphql/CheckoutAddLine.graphql`               | Add line mutation                                                           |
| `src/graphql/CheckoutDeleteLines.graphql`           | Delete lines mutation                                                       |
| `src/graphql/CheckoutFind.graphql`                  | Fetch checkout with lines                                                   |
| `src/graphql/CheckoutCreate.graphql`                | Create empty checkout                                                       |

---

## Cart Mutations

### Add to Cart

```graphql
# src/graphql/CheckoutAddLine.graphql
mutation CheckoutAddLine($id: ID!, $productVariantId: ID!) {
	checkoutLinesAdd(id: $id, lines: [{ quantity: 1, variantId: $productVariantId }]) {
		checkout {
			id
			lines {
				id
				quantity
				variant {
					name
					product {
						name
					}
				}
			}
		}
		errors {
			message
		}
	}
}
```

Always adds quantity 1. To add multiple, modify the `quantity` field in the mutation.

### Delete from Cart

```graphql
# src/graphql/CheckoutDeleteLines.graphql
mutation CheckoutDeleteLines($checkoutId: ID!, $lineIds: [ID!]!) {
	checkoutLinesDelete(id: $checkoutId, linesIds: $lineIds) {
		checkout {
			id
		}
		errors {
			field
			code
		}
	}
}
```

### Update Line Quantity

```graphql
# src/checkout/graphql/checkout.graphql
mutation checkoutLinesUpdate($checkoutId: ID!, $lines: [CheckoutLineUpdateInput!]!) {
	checkoutLinesUpdate(id: $checkoutId, lines: $lines) {
		errors {
			...CheckoutErrorFragment
		}
		checkout {
			...CheckoutFragment
		}
	}
}
```

Used during checkout for inline quantity editing.

---

## Add-to-Cart Server Action

The primary add-to-cart flow is an inline server action in the PDP:

```typescript
// src/ui/components/pdp/variant-section-dynamic.tsx
async function addToCart() {
	"use server";

	// 1. Get or create checkout
	const checkout = await Checkout.findOrCreate({
		checkoutId: await Checkout.getIdFromCookies(channel),
		channel,
	});
	if (!checkout) {
		console.error("Add to cart: Failed to create checkout");
		return;
	}

	// 2. Execute mutation
	const result = await executeAuthenticatedGraphQL(CheckoutAddLineDocument, {
		variables: { id: checkout.id, productVariantId: selectedVariantID },
		cache: "no-cache",
	});
	if (!result.ok) {
		console.error("Add to cart failed:", result.error.message);
		return;
	}

	// 3. Revalidate cart page
	revalidatePath("/cart");
}
```

The form submits to this action via `<form action={addToCart}>`, and the client-side `AddButton` component shows loading state via `useFormStatus()`.

---

## Cart Page Server Actions

```typescript
// src/ui/components/cart/actions.ts
"use server";

export async function deleteCartLine(checkoutId: string, lineId: string) {
	const result = await executeAuthenticatedGraphQL(CheckoutDeleteLinesDocument, {
		variables: { checkoutId, lineIds: [lineId] },
		cache: "no-cache",
	});

	// Clear checkout cookie if cart is now empty
	if (result.ok) {
		const checkout = result.data.checkoutLinesDelete?.checkout;
		if (checkout && checkout.lines.length === 0) {
			await Checkout.clearCheckoutCookie(checkout.channel.slug);
		}
	}

	revalidatePath("/cart");
	revalidatePath("/"); // Update cart badge count
}

export async function updateCartLineQuantity(checkoutId: string, lineId: string, quantity: number) {
	await executeAuthenticatedGraphQL(CheckoutLinesUpdateDocument, {
		variables: { checkoutId, lines: [{ lineId, quantity }] },
		cache: "no-cache",
	});

	revalidatePath("/cart");
	revalidatePath("/");
}
```

Client components call these with `useTransition` for loading state:

```tsx
const [isPending, startTransition] = useTransition();
const handleRemove = (lineId: string) => {
	startTransition(() => deleteCartLine(checkoutId, lineId));
};
```

---

## Checkout Cookie Management

```typescript
// src/lib/checkout.ts

// Read checkout ID from cookies
export async function getIdFromCookies(channel: string): Promise<string> {
	try {
		return (await cookies()).get(`checkoutId-${channel}`)?.value || "";
	} catch {
		return ""; // During static generation, cookies() throws
	}
}

// Find existing or create new checkout
export async function findOrCreate({ channel, checkoutId }) {
	if (!checkoutId) {
		const result = await create({ channel });
		return result.ok ? result.data.checkoutCreate?.checkout : null;
	}
	const checkout = await find(checkoutId);
	return checkout || (await create({ channel })).data?.checkoutCreate?.checkout;
}
```

Cookie flags: `secure: true` (HTTPS), `sameSite: "lax"`. NOT httpOnly — accessible from client JS for checkout redirect flows.

---

## Cart Badge (Header)

```tsx
// src/ui/components/nav/components/CartNavItem.tsx (Server Component)
export async function CartNavItem({ channel }: { channel: string }) {
	const checkoutId = await Checkout.getIdFromCookies(channel);
	const checkout = checkoutId ? await Checkout.find(checkoutId) : null;
	const itemCount = checkout?.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0;

	return (
		<Link href="/cart">
			<ShoppingBag />
			{itemCount > 0 && <span>{itemCount}</span>}
		</Link>
	);
}
```

---

## Common Issues

### Stale cart after mutation

**Symptom**: Cart page doesn't reflect add/remove action.

**Cause**: Missing `revalidatePath` call in the server action.

**Fix**: Always call `revalidatePath("/cart")` and `revalidatePath("/")` after cart mutations.

### Lost checkout on channel switch

**Symptom**: Cart appears empty after switching channels.

**Cause**: Checkout cookie is per-channel (`checkoutId-{channel}`). Each channel has its own cart.

**Fix**: This is expected behavior. The cart is channel-specific because pricing, availability, and currency differ per channel.

### Add-to-cart does nothing

**Symptom**: Button shows loading then returns to normal, but cart count doesn't change.

**Debug steps**:

1. Check server logs for `console.error` from the action
2. Verify the variant ID is valid and in stock
3. Check that `Checkout.findOrCreate` succeeds (cookie readable)
4. Confirm the GraphQL mutation succeeds (`result.ok`)

---

## Anti-patterns

- **Don't store cart state in React context or client state** — Use server-side cookies and revalidation
- **Don't read `checkoutId` cookie from client JS unnecessarily** — Prefer reading it in server actions/components
- **Don't forget `cache: "no-cache"`** on cart mutations — Stale responses cause incorrect cart display
- **Don't hardcode channel in CheckoutCreate** — Use the dynamic channel from URL params
- **Don't skip `revalidatePath("/")` after cart changes** — The cart badge in the header needs to update
