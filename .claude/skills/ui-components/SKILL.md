---
name: ui-components
description: Create and style UI components with design tokens. Use when creating components, styling with Tailwind, deciding between Server/Client Components, or using shadcn/ui primitives.
---

# UI Components

> **Source**: [shadcn/ui](https://ui.shadcn.com/) - Component patterns and primitives used in this project

## When to Use

Use this skill when:

- Creating new UI components
- Styling components with Tailwind
- Deciding between Server and Client Components
- Using shadcn/ui primitives

## Instructions

### Component Location

| Type                       | Location                  |
| -------------------------- | ------------------------- |
| Shared components          | `src/ui/components/`      |
| Product page components    | `src/ui/components/pdp/`  |
| Product listing components | `src/ui/components/plp/`  |
| Base primitives            | `src/ui/components/ui/`   |
| Navigation                 | `src/ui/components/nav/`  |
| Cart                       | `src/ui/components/cart/` |

### Server vs Client Components

**Default: Server Components** (no directive needed)

```tsx
// Server Component - can use async/await, no useState/useEffect
export async function ProductInfo({ slug }: { slug: string }) {
	const data = await fetchProduct(slug);
	return <div>{data.name}</div>;
}
```

**Client Components** (only when needed)

```tsx
"use client";
import { useState } from "react";

export function Counter() {
	const [count, setCount] = useState(0);
	return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

Use `"use client"` only when you need:

- `useState`, `useEffect`, `useContext`
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs (`localStorage`, `window`, etc.)

### Design Tokens

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

### Using shadcn/ui Primitives

Import from `@/ui/components/ui/`:

```tsx
import { Button } from "@/ui/components/ui/Button";
import { Badge } from "@/ui/components/ui/Badge";
import { Sheet, SheetContent, SheetTrigger } from "@/ui/components/ui/Sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/ui/components/ui/DropdownMenu";
```

### Export Pattern

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
