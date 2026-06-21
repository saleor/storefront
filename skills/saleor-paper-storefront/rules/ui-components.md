# UI Components

Create and style UI components with design tokens and shadcn/ui primitives.

> **Design system (tokens, type scale, width, rhythm, cva variant matrix):** [`ui-design-system.md`](ui-design-system.md) — read it before non-trivial design work.  
> **Marketing sections / page molding:** [`ui-sections.md`](ui-sections.md), [`page-composition.md`](page-composition.md) · **Design bar:** [`design-quality-rubric.md`](design-quality-rubric.md)  
> **File naming & imports:** [`references/code-conventions.md`](../references/code-conventions.md)  
> **Source**: [shadcn/ui](https://ui.shadcn.com/) - Component patterns and primitives used in this project

## Component Location

| Type                          | Location                  |
| ----------------------------- | ------------------------- |
| Shared components             | `src/ui/components/`      |
| Homepage & marketing sections | `src/ui/sections/`        |
| Product page components       | `src/ui/components/pdp/`  |
| Product listing components    | `src/ui/components/plp/`  |
| Base primitives               | `src/ui/components/ui/`   |
| Navigation                    | `src/ui/components/nav/`  |
| Cart                          | `src/ui/components/cart/` |

## Design Tokens

**Single source of truth:** `src/styles/brand.css`. See `src/styles/README.md` for the full workflow.

Use semantic Tailwind classes (mapped in `tailwind.config.cjs`):

```tsx
// Resolves to brand.css via tailwind.config.cjs
<div className="bg-background text-foreground border-border">
<button className="bg-primary text-primary-foreground">
<span className="text-muted-foreground">

// Inverse footer (bg-foreground)
<p className="text-inverse-subtle">
```

Available tokens:

- `background`, `foreground` - Main bg/text
- `primary`, `primary-foreground` - Primary actions
- `secondary`, `secondary-foreground` - Secondary elements
- `muted`, `muted-foreground` - Subdued elements
- `inverse`, `inverse-subtle`, `inverse-muted` - Text on inverse surfaces (`bg-foreground`)
- `border`, `border-inverse` - Borders
- `destructive` - Error/danger states

## Using shadcn/ui Primitives

Import from `@/ui/components/ui/`:

```tsx
import { Button } from "@/ui/components/ui/button";
import { Badge } from "@/ui/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/components/ui/dropdown-menu";
```

## Export Pattern

If component is in a subdirectory, export from index:

```typescript
// src/ui/components/pdp/index.ts
export { NewComponent } from "./NewComponent";
```

## Swappable variants of a component

Three mechanisms — pick by **when the choice is made** and **whether the unused variants are heavy**:

| You need…                                                                                          | Use                                                 | Do the unused variants ship? |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------- |
| Visual variations of one component (size, tone, emphasis)                                          | **`cva` prop variants** — see `ui-design-system.md` | n/a (one component)          |
| One of several **distinct, heavy** implementations, chosen at **build time**, others must not ship | **Variant registry** (below)                        | No — only the active one     |
| Different implementation per request/product at **runtime**                                        | Plain conditional render (all candidates ship)      | Yes (can't tree-shake)       |

### Variant registry (build-time choice)

When a shop picks **one** of several mutually-exclusive, non-trivial implementations at build time (different PDP galleries, homepage hero styles, etc.) and you don't want the unused ones in the bundle, use a registry keyed by a build-time constant. Reference implementation: `src/ui/components/pdp/gallery-registry.tsx` (see `product-pdp.md`).

```tsx
// foo-registry.tsx — the ONLY module that imports the renderers
const Fancy = dynamic(() => import("./foo-fancy").then((m) => m.FooFancy)); // "use client"
export const FOO_REGISTRY: Record<FooVariant, ComponentType<FooProps>> = {
	plain: FooPlain, // Server Component → imported directly (0 client JS)
	fancy: Fancy, // client → lazy, ships only when active
};
export const activeFoo = () => FOO_REGISTRY[FOO_VARIANT];
```

Why it stays concise:

- **`next/dynamic`** gives each client variant its own chunk → only the active one is requested.
- **`Record<FooVariant, …>`** is exhaustive → the compiler forces an entry per variant.
- **Renderers stay out of barrels (`index.ts`).** This is the only real footgun: re-exporting multiple `"use client"` variants through a barrel a Server Component imports defeats tree-shaking and pulls them all in. A plain unused `import` (no re-export) is tree-shaken normally.

**Don't over-reach:** for lightweight visual differences reach for `cva`, not a registry. The registry is a convenient default, not a cage — a fork is free to delete the others and hardcode its chosen variant (one import, one render, ships one).

## Examples

### Basic Component

```tsx
import { cn } from "@/lib/utils";

interface CardProps {
	title: string;
	children: React.ReactNode;
	className?: string;
}

export function Card({ title, children, className }: CardProps) {
	return (
		<div className={cn("rounded-lg border border-border bg-card p-4", className)}>
			<h3 className="font-medium text-foreground">{title}</h3>
			<div className="mt-2 text-muted-foreground">{children}</div>
		</div>
	);
}
```

## Anti-patterns

❌ **Don't hardcode brand colors** (hex/rgb in components) when a token exists — edit `brand.css` instead  
❌ **Don't add `"use client"` unless needed** - Prefer Server Components  
❌ **Don't create new primitives** - Use existing shadcn/ui components  
❌ **Don't use inline styles** for brand colors - Use Tailwind classes backed by tokens
