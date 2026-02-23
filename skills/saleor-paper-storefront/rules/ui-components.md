# UI Components

Create and style UI components with design tokens and shadcn/ui primitives.

> **Source**: [shadcn/ui](https://ui.shadcn.com/) - Component patterns and primitives used in this project

## Component Location

| Type                       | Location                  |
| -------------------------- | ------------------------- |
| Shared components          | `src/ui/components/`      |
| Product page components    | `src/ui/components/pdp/`  |
| Product listing components | `src/ui/components/plp/`  |
| Base primitives            | `src/ui/components/ui/`   |
| Navigation                 | `src/ui/components/nav/`  |
| Cart                       | `src/ui/components/cart/` |

## Design Tokens

Use semantic Tailwind classes that reference CSS variables from `src/styles/brand.css`:

```tsx
// ✅ Good - uses design tokens
<div className="bg-background text-foreground border-border">
<button className="bg-primary text-primary-foreground">
<span className="text-muted-foreground">

// ❌ Bad - hardcoded colors
<div className="bg-white text-black border-gray-200">
```

Available tokens:

- `background`, `foreground` - Main bg/text
- `primary`, `primary-foreground` - Primary actions
- `secondary`, `secondary-foreground` - Secondary elements
- `muted`, `muted-foreground` - Subdued elements
- `border` - Border color
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

❌ **Don't use hardcoded colors** - Use design tokens  
❌ **Don't add `"use client"` unless needed** - Prefer Server Components  
❌ **Don't create new primitives** - Use existing shadcn/ui components  
❌ **Don't use inline styles** - Use Tailwind classes
