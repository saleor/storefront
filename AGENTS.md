# AI Agent Guidelines for Saleor Storefront

This document contains essential information for AI agents working on this codebase.

> **Note for AI Tools**: This file is loaded as workspace rules in Cursor. A condensed version
> is also available in `.cursorrules` for tools that use that convention.

---

## Quick Reference

### After Modifying GraphQL Files

```bash
pnpm run generate
```

**Always run this after changing any `.graphql` file** in `src/graphql/` or `src/checkout/graphql/`.

### Build & Type Check

```bash
pnpm run build          # Full build (runs generate automatically via prebuild)
pnpm exec tsc --noEmit  # Type check only
```

### Development

```bash
pnpm run dev            # Start dev server (runs generate automatically via predev)
```

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) pattern (Radix UI primitives)
- **GraphQL**: Saleor API with `graphql-codegen` for type generation
- **State**: React Context (cart), Zustand (checkout module only)

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [channel]/          # Channel-scoped routes
│   │   └── (main)/         # Main layout (header/footer)
│   │       └── products/   # Product pages
│   ├── api/                # API routes
│   │   ├── og/             # Dynamic OG image generation
│   │   └── revalidate/     # Cache invalidation endpoint
│   ├── checkout/           # Checkout flow
│   └── actions.ts          # Global server actions
├── graphql/                # GraphQL queries/mutations for storefront
├── checkout/graphql/       # GraphQL for checkout module
├── gql/                    # AUTO-GENERATED - Do not edit manually
├── ui/
│   ├── components/         # Shared UI components
│   │   ├── cart/           # Cart drawer and context
│   │   ├── pdp/            # Product detail page components
│   │   ├── ui/             # Base UI primitives (Button, Badge, Sheet, etc.)
│   │   └── nav/            # Navigation components
│   └── atoms/              # Small reusable atoms
├── lib/                    # Utilities and helpers
│   ├── seo/                # SEO configuration and helpers
│   ├── graphql.ts          # GraphQL client
│   ├── checkout.ts         # Checkout utilities
│   └── utils.ts            # General utilities
└── styles/
    └── brand.css           # Brand-specific design tokens
```

---

## GraphQL Workflow

### 1. Query/Mutation Files Location

- **Storefront queries**: `src/graphql/*.graphql`
- **Checkout queries**: `src/checkout/graphql/*.graphql`

### 2. After Any GraphQL Change

```bash
pnpm run generate
```

This regenerates `src/gql/` with updated TypeScript types.

### 3. Using Generated Types

```typescript
import { ProductDetailsDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

const { product } = await executeGraphQL(ProductDetailsDocument, {
	variables: { slug, channel },
	revalidate: 60,
});
// `product` is fully typed based on your query
```

### 4. Common GraphQL Gotchas

#### Permission Errors

Some Saleor fields require authentication or specific permissions. If you see:

```
"To access this path, you need one of the following permissions: MANAGE_..."
```

The field requires admin permissions. Check the [Saleor API docs](https://docs.saleor.io/api-reference) for field permissions.

**Safe patterns** (used in checkout):

```graphql
# For variant attributes - use variantSelection argument
attributes(variantSelection: ALL) {
  values { name value }
  attribute { name slug }
}
```

#### Nullable Fields

Saleor's GraphQL schema has many nullable fields. Always use optional chaining:

```typescript
// Good
const name = product.category?.name ?? "Uncategorized";

// Bad - will crash if category is null
const name = product.category.name;
```

---

## Styling System

### Design Tokens

Brand-specific tokens are in `src/styles/brand.css`:

```css
:root {
	--background: oklch(0.98 0.005 90);
	--foreground: oklch(0.12 0 0);
	--primary: oklch(0.12 0 0);
	/* ... */
}
```

### Using Tokens in Components

```tsx
// Use semantic color names from Tailwind config
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
```

### Dark Mode

Dark mode variables are defined in `brand.css` under `.dark` selector.

---

## Common Tasks

### Adding a New GraphQL Field

1. **Edit the `.graphql` file**:

   ```graphql
   # src/graphql/ProductDetails.graphql
   query ProductDetails($slug: String!, $channel: String!) {
   	product(slug: $slug, channel: $channel) {
   		id
   		name
   		newField # Add your field
   	}
   }
   ```

2. **Regenerate types**:

   ```bash
   pnpm run generate
   ```

3. **Use in code** - TypeScript will now recognize `product.newField`

### Creating a New UI Component

1. **Create the component** in appropriate directory:

   - `src/ui/components/` for shared components
   - `src/ui/components/pdp/` for product page components
   - `src/ui/components/ui/` for base primitives

2. **Export from index** if in a subdirectory:

   ```typescript
   // src/ui/components/pdp/index.ts
   export { NewComponent } from "./NewComponent";
   ```

3. **Use semantic tokens** for styling:
   ```tsx
   <div className="bg-card border border-border rounded-lg p-4">
   ```

### Modifying the Product Page

The main product page is at:

```
src/app/[channel]/(main)/products/[slug]/page.tsx
```

Key components used:

- `ProductGallery` - Image carousel with thumbnails
- `VariantSelector` - Size/color selection
- `AddToCart` - Price display and add to cart button
- `ProductAttributes` - Accordion with description/details
- `StickyBar` - Mobile sticky add to cart

---

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
```

Optional:

```env
# SEO & Metadata
NEXT_PUBLIC_STOREFRONT_URL=   # Base URL for canonical URLs and OG images

# Cache Invalidation
REVALIDATE_SECRET=            # Secret for manual cache invalidation via GET
SALEOR_WEBHOOK_SECRET=        # HMAC secret for Saleor webhook verification

# App Token (see Security section below)
SALEOR_APP_TOKEN=             # For accessing protected queries (channels list)
```

### Webhook Setup (for on-demand revalidation)

1. In Saleor Dashboard → Settings → Webhooks
2. Create webhook pointing to `https://your-store.com/api/revalidate`
3. Subscribe to: `PRODUCT_CREATED`, `PRODUCT_UPDATED`, `PRODUCT_DELETED`
4. Copy the webhook secret to `SALEOR_WEBHOOK_SECRET`

---

## Security: App Token for Storefronts

> **Source**: [Saleor Docs - App Permissions](https://docs.saleor.io/developer/extending/apps/architecture/app-permissions)

### The Challenge

The storefront needs `SALEOR_APP_TOKEN` only for the `channels` query (to show channel selector). This query requires `MANAGE_CHANNELS` permission, which is more than what a public storefront should have.

### Security Principles

1. **Server-side only**: The token is NOT prefixed with `NEXT_PUBLIC_`, so it never reaches the browser
2. **Minimal permissions**: Create a dedicated app with ONLY the permissions needed
3. **No token is best**: If you don't need the channel selector, don't use a token at all

### Recommended Setup

**Option 1: No token (simplest, most secure)**

If you have a single channel or can hardcode channel slugs:

```typescript
// src/app/[channel]/layout.tsx
export const generateStaticParams = async () => {
	// Hardcode your channel(s) - no token needed
	return [{ channel: "default-channel" }, { channel: "us-channel" }];
};
```

**Option 2: Dedicated minimal-permission app**

If you need dynamic channel fetching:

1. Create a new App in Saleor Dashboard → Apps → Create Local App
2. Name it "Storefront Channel Reader" (descriptive name)
3. Assign ONLY `MANAGE_CHANNELS` permission
4. Generate a token and use it as `SALEOR_APP_TOKEN`

### What NOT to do

- ❌ Don't use an app token with `MANAGE_PRODUCTS`, `MANAGE_ORDERS`, etc.
- ❌ Don't reuse tokens from other apps (checkout, admin tools)
- ❌ Don't prefix with `NEXT_PUBLIC_` (would expose to browser)

### Current Usage

The storefront uses `SALEOR_APP_TOKEN` in exactly two places:

| File                           | Purpose                             | Permission Needed |
| ------------------------------ | ----------------------------------- | ----------------- |
| `src/app/[channel]/layout.tsx` | `generateStaticParams` for channels | `MANAGE_CHANNELS` |
| `src/ui/components/Footer.tsx` | Channel selector dropdown           | `MANAGE_CHANNELS` |

Both are Server Components, so the token stays server-side.

---

## Troubleshooting

### "Cannot find module '@/gql/graphql'"

Run `pnpm run generate` - GraphQL types haven't been generated.

### "Property 'X' does not exist on type"

After adding a GraphQL field, run `pnpm run generate` to update types.

### Permission errors from Saleor API

Check if the field requires authentication. See "Permission Errors" section above.

---

## Rich Text Content (EditorJS)

Saleor uses EditorJS for rich text content (product descriptions, page content). Here's how to handle it:

> **Source**: [EditorJS Documentation](https://editorjs.io/) | [editorjs-html parser](https://www.npmjs.com/package/editorjs-html)

### Parsing EditorJS Content

```typescript
import edjsHTML from "editorjs-html";
import xss from "xss";

const parser = edjsHTML();

// Parse and sanitize
const descriptionHtml = product.description
	? parser.parse(JSON.parse(product.description)).map((html: string) => xss(html))
	: null;
```

### Rendering HTML Content

```tsx
// Use dangerouslySetInnerHTML with sanitized content
<div className="prose prose-sm">
	{descriptionHtml?.map((html, index) => <div key={index} dangerouslySetInnerHTML={{ __html: html }} />)}
</div>
```

### Important Notes

- Always use `xss()` to sanitize HTML before rendering
- Use Tailwind's `prose` class for typography styling
- Handle parsing errors gracefully (EditorJS JSON might be malformed)

---

## Investigating Saleor Core Behavior

When there's ambiguity about how the Saleor API works, **clone the Saleor core repository** to investigate the source code directly. This is the definitive source of truth.

> **Documentation Sources**:
>
> - [Saleor API Reference](https://docs.saleor.io/api-reference) - Official GraphQL schema docs
> - [Saleor Developer Docs](https://docs.saleor.io/developer) - Guides and concepts
> - [Saleor Core GitHub](https://github.com/saleor/saleor) - Source code (ultimate truth)

### Quick Clone (shallow, for investigation only)

```bash
cd /tmp && git clone --depth 1 https://github.com/saleor/saleor.git saleor-core
```

### Key Directories in Saleor Core

| Path                        | Purpose                           |
| --------------------------- | --------------------------------- |
| `saleor/graphql/`           | GraphQL schema, resolvers, types  |
| `saleor/graphql/product/`   | Product-related queries/mutations |
| `saleor/graphql/attribute/` | Attribute handling                |
| `saleor/product/models.py`  | Product Django models             |
| `saleor/attribute/models/`  | Attribute Django models           |

### Example: Understanding `visibleInStorefront`

The documentation may not always clarify API behavior. For example, does `product.attributes` auto-filter by `visibleInStorefront`?

**Answer from source code** (`saleor/graphql/product/resolvers.py`):

```python
def resolve_product_attributes(root, info, *, limit):
    if requestor_has_access_to_all_attributes(info.context):
        dataloader = AttributesByProductIdAndLimitLoader        # Admin: ALL
    else:
        dataloader = AttributesVisibleToCustomerByProductIdAndLimitLoader  # Customer: FILTERED
```

The `AttributesVisibleToCustomerByProductIdAndLimitLoader` filters with:

```python
attribute__visible_in_storefront=True
```

**Conclusion**: Storefront users only receive attributes with `visibleInStorefront=True`. No client-side filtering needed.

> **Source**: [`saleor/graphql/product/resolvers.py`](https://github.com/saleor/saleor/blob/main/saleor/graphql/product/resolvers.py) - see `resolve_product_attributes` function.

### Key Insight: Storefront API Auto-Filtering

Saleor's GraphQL API filters data based on the **authentication token**:

```python
# From saleor/graphql/context.py
def set_app_on_context(request):
    request.app = get_app_promise(request).get()  # From Authorization header

def set_auth_on_context(request):
    if request.app:
        request.user = None  # App token takes precedence
    else:
        request.user = authenticate(request)  # JWT user token
```

The permission check (`saleor/graphql/product/resolvers.py`):

```python
def requestor_has_access_to_all_attributes(context):
    requestor = context.app or context.user
    return requestor and requestor.has_perm(ProductPermissions.MANAGE_PRODUCTS)
```

| Token                               | `product.attributes` returns    |
| ----------------------------------- | ------------------------------- |
| **None** (anonymous)                | Only `visibleInStorefront=True` |
| **Customer JWT** (no admin perms)   | Only `visibleInStorefront=True` |
| **App/User with `MANAGE_PRODUCTS`** | ALL attributes                  |

This means when building storefront features, you don't need to:

- Fetch `visibleInStorefront` field
- Filter attributes client-side

The API already returns only what's meant to be shown. This pattern applies to other "visible in storefront" flags across Saleor.

### When to Clone Saleor Core

- API behavior is unclear from documentation
- Permission errors occur and you need to understand why
- You need to understand the exact data model
- GraphQL schema questions (what fields exist, what arguments are supported)

---

## Product Types and Variant Attributes

In Saleor, **which attributes appear on variants** is configured at the **ProductType** level, not the product level.

> **Source**: [Saleor Docs - Attributes](https://docs.saleor.io/developer/attributes/overview)

### Configuration Location

Dashboard → Configuration → Product Types → [Select Type] → Variant Attributes

### Key Concepts

| Attribute Type         | Where Configured         | Example                        |
| ---------------------- | ------------------------ | ------------------------------ |
| **Product Attributes** | Shared by all variants   | Brand, Material                |
| **Variant Attributes** | Differ per variant       | Size, Color                    |
| **Variant Selection**  | Used to select a variant | Size (for size-only selection) |

### Important: Product vs Variant Attributes

In Saleor's data model, product attributes and variant attributes are stored separately:

- `ProductType.product_attributes` → via `AttributeProduct` through model
- `ProductType.variant_attributes` → via `AttributeVariant` through model

The **same attribute can technically exist in both** (no database constraint), but this is generally not recommended as it creates confusion. The Dashboard UI may enforce this separation.

### Example: Color Swatches

For color swatches to appear in the storefront:

1. Create a **Swatch-type attribute** called "Color" (slug: `color`)
2. Add it as a **Variant Attribute** in the ProductType
3. Optionally add it to **Variant Selection** if customers pick by color

If "Color" is only a Product Attribute (not Variant Attribute), it won't appear in `variant.attributes` - this is intentional. The ProductType controls what data is available per variant.

### GraphQL Query Pattern

```graphql
# Variant attributes come from ProductType configuration
variants {
  attributes(variantSelection: ALL) {
    attribute { name slug }
    values { name value }
  }
}
```

The `variantSelection: ALL` argument returns all variant attributes, not just those used for selection.

---

## Variant Selection System

The storefront includes a modular variant selection system in `src/ui/components/pdp/variant-selection/`.

### Core Concepts

#### 1. Saleor's Cart Model

**You add VARIANTS to cart, not products.** Each variant is a specific combination of attributes:

| Product | Attributes     | Variant ID |
| ------- | -------------- | ---------- |
| T-Shirt | Black + Medium | `abc123`   |
| T-Shirt | Black + Large  | `def456`   |
| T-Shirt | White + Medium | `ghi789`   |

The `checkoutLinesAdd` mutation requires a specific `variantId`. Without selecting ALL attributes, there's no variant to add.

#### 2. Multi-Attribute Selection

Products can have multiple variant attributes (e.g., Color AND Size). The system:

- Shows a **separate selector for each attribute**
- Tracks selections independently in URL params
- Only enables "Add to Cart" when ALL attributes are selected

```
URL: ?color=black&size=m&variant=abc123
      ↑          ↑       ↑
   Color sel  Size sel  Matching variant (set automatically)
```

#### 3. Availability vs Compatibility

| State            | Meaning                                          | Visual        | Clickable?                  |
| ---------------- | ------------------------------------------------ | ------------- | --------------------------- |
| **Available**    | In stock                                         | Normal        | ✓                           |
| **Incompatible** | No variant exists with this + current selections | Dimmed        | ✓ (clears other selections) |
| **Out of stock** | Variant exists but quantity = 0                  | Strikethrough | ✗                           |

#### 4. Smart Adjustment

When user selects an incompatible option:

```
State: ?color=red (Red only exists for MP3)
User clicks: "iTimes" format
Result: ?format=itimes (Red is cleared, not blocked)
```

Users are never "stuck" - they can always explore all options.

#### 5. Dead End Detection

When a selection has no available options in another group:

```
User selects: Red
All sizes in Red: Out of stock
Message shown: "No size available in Red"
```

### Key Functions

| Function                        | Purpose                                       |
| ------------------------------- | --------------------------------------------- |
| `groupVariantsByAttributes()`   | Extract unique attribute values from variants |
| `findMatchingVariant()`         | Find variant matching ALL selected attributes |
| `getAdjustedSelections()`       | Clear conflicting selections when needed      |
| `getUnavailableAttributeInfo()` | Detect dead-end selections                    |

### Customization

The system is designed for easy customization:

```tsx
// 1. Replace entire section
<MyCustomVariantSection variants={variants} ... />

// 2. Custom renderers per attribute type
<VariantSelectionSection
  renderers={{
    color: MyColorPicker,
    size: MySizeChart,
  }}
/>

// 3. Full override with children
<VariantSelectionSection variants={variants}>
  <MyCompletelyCustomUI />
</VariantSelectionSection>
```

### File Structure

```
src/ui/components/pdp/variant-selection/
├── index.ts                    # Public exports
├── types.ts                    # TypeScript interfaces
├── utils.ts                    # Data transformation & logic
├── VariantSelector.tsx         # Single attribute selector
├── VariantSelectionSection.tsx # Main container
└── renderers/
    ├── ColorSwatchOption.tsx   # Color swatch (circular)
    ├── SizeButtonOption.tsx    # Size button (rectangular)
    └── TextOption.tsx          # Generic text (fallback)
```

---

## SEO System

The storefront has a modular SEO system in `src/lib/seo/` that can be easily configured or disabled.

### Configuration

All SEO settings are in `src/lib/seo/config.ts`:

```typescript
export const seoConfig = {
  siteName: "Saleor Store",           // Site name in titles
  description: "...",                  // Default description
  twitterHandle: null,                 // Set to enable Twitter cards
  enableJsonLd: true,                  // Toggle structured data
  enableOpenGraph: true,               // Toggle OG tags
  enableTwitterCards: true,            // Toggle Twitter cards
  noIndexPaths: ["/checkout", ...],    // Excluded from crawlers
};
```

### Usage

**Root layout metadata:**

```typescript
// src/app/layout.tsx
import { rootMetadata } from "@/lib/seo";
export const metadata = rootMetadata;
```

**Page metadata:**

```typescript
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
	return buildPageMetadata({
		title: "Page Title",
		description: "Description",
		image: "/og-image.jpg",
		url: "/page-path",
	});
}
```

**Product JSON-LD:**

```typescript
import { buildProductJsonLd } from "@/lib/seo";

const jsonLd = buildProductJsonLd({
  name: product.name,
  price: { amount: 29.99, currency: "USD" },
  inStock: true,
});

// In JSX:
{jsonLd && (
  <script type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
)}
```

### Dynamic OG Images

The `/api/og` route generates branded OG images:

```
/api/og?title=Product%20Name&price=€29.99
```

### Disabling SEO

To remove SEO features entirely:

1. Delete `src/lib/seo/` folder
2. Remove `rootMetadata` import from layout
3. Remove `buildPageMetadata`/`buildProductJsonLd` from pages
4. Delete `src/app/api/og/`

---

## Cart System

The cart uses a drawer pattern with React Context for state management.

### Architecture

```
src/ui/components/cart/
├── CartContext.tsx      # React Context with cart state
├── CartDrawer.tsx       # Drawer UI component
├── CartButton.tsx       # Header cart icon (opens drawer)
├── CartDrawerWrapper.tsx # Client wrapper for layout
├── actions.ts           # Server actions (update/delete lines)
└── index.ts             # Public exports
```

### Usage

The cart is included in the main layout automatically. To trigger the drawer:

```typescript
import { useCart } from "@/ui/components/cart";

function MyComponent() {
  const { openCart, items, subtotal } = useCart();

  return <button onClick={openCart}>View Cart ({items.length})</button>;
}
```

### Server Actions

```typescript
// Update line quantity
import { updateLineQuantity, deleteLine } from "@/ui/components/cart/actions";

await updateLineQuantity(checkoutId, lineId, quantity);
await deleteLine(checkoutId, lineId);
```

---

## Caching & Performance

### ISR (Incremental Static Regeneration)

Product pages use ISR with 5-minute revalidation:

```typescript
// src/app/[channel]/(main)/products/[slug]/page.tsx
export const revalidate = 300; // 5 minutes
```

### Static Generation

Popular products are pre-rendered at build time. Configure in `src/config/static-pages.ts`:

```typescript
export const staticPagesConfig = {
	products: {
		// Option 1: Explicit slugs (recommended for key products)
		slugs: ["hero-product", "bestseller-tee", "new-arrival"],

		// Option 2: Fetch from a Saleor collection
		collection: "featured",

		// Option 3: Fetch top N products (default fallback)
		fetchCount: 20,
	},

	// Hardcode channels to avoid needing SALEOR_APP_TOKEN
	channels: ["default-channel"],
};
```

Priority: `slugs` → `collection` → `fetchCount` (first non-null wins)

### On-Demand Revalidation

The `/api/revalidate` endpoint supports cache invalidation:

**Manual (protected by secret):**

```bash
curl "/api/revalidate?secret=xxx&path=/default-channel/products/my-product"
```

**Saleor Webhooks:**
Configure a webhook in Saleor Dashboard pointing to `/api/revalidate`. The endpoint:

- Verifies HMAC signature from `SALEOR_WEBHOOK_SECRET`
- Automatically revalidates product, category, and collection pages

### GraphQL Caching

```typescript
const { product } = await executeGraphQL(ProductDetailsDocument, {
	variables: { slug, channel },
	revalidate: 300, // Cache for 5 minutes
	// OR
	cache: "no-cache", // Skip cache (for mutations)
});
```
