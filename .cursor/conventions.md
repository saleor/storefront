# Code Conventions

## File Naming

**Use kebab-case for all files** (the shadcn/ui standard):

```
✓ product-card.tsx
✓ use-auth.ts
✓ filter-utils.ts
✓ auth-provider.tsx

✗ ProductCard.tsx
✗ useAuth.ts
✗ filterUtils.ts
✗ AuthProvider.tsx
```

### Why kebab-case?

1. **No case-sensitivity bugs** - macOS/Windows are case-insensitive, Linux isn't
2. **One simple rule** - no need to remember "components = Pascal, hooks = camel"
3. **Shell-friendly** - easier to type in terminal
4. **Industry standard** - shadcn/ui, Vercel Commerce, Remix all use this
5. **Next.js alignment** - App Router already uses kebab-case for routes

### Special Suffixes

| Suffix       | Purpose                                        | Example                |
| ------------ | ---------------------------------------------- | ---------------------- |
| `.server.ts` | Server-only code (uses `import "server-only"`) | `auth.server.ts`       |
| `.client.ts` | Client-only code (rare)                        | `analytics.client.ts`  |
| `.test.ts`   | Unit tests                                     | `filter-utils.test.ts` |

### Directory Names

Also kebab-case:

```
✓ src/ui/components/
✓ src/lib/auth/
✓ src/checkout/views/

✗ src/UI/Components/
✗ src/lib/Auth/
```

### Exceptions

- `README.md`, `AGENTS.md` - uppercase by convention
- Config files follow their ecosystem (`next.config.js`, `tsconfig.json`)
- GraphQL files match operation names (`ProductDetails.graphql`)

## Component Exports

Even with kebab-case files, **export PascalCase components**:

```tsx
// file: product-card.tsx
export function ProductCard() { ... }

// file: use-cart.ts
export function useCart() { ... }
```

## Imports

Use the `@/` alias for all internal imports:

```tsx
✓ import { Button } from "@/ui/components/ui/button";
✓ import { useCart } from "@/lib/hooks/use-cart";

✗ import { Button } from "../../../ui/components/ui/Button";
```
