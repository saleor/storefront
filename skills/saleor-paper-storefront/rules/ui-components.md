# UI Components

Build and style UI components using Tailwind CSS, `@headlessui/react` for accessible interactive primitives, and `lucide-react` for icons. The project is ~75% Server Components — only use `"use client"` when you need hooks or browser interactivity.

---

## Component Locations

| Type                    | Location                   |
| ----------------------- | -------------------------- |
| Shared components       | `src/ui/components/`       |
| Product page (PDP)      | `src/ui/components/pdp/`   |
| Product listing (PLP)   | `src/ui/components/plp/`   |
| Navigation              | `src/ui/components/nav/`   |
| Cart                    | `src/ui/components/cart/`  |
| Atoms (Loader, Overlay) | `src/ui/atoms/`            |
| Checkout components     | `src/checkout/components/` |

---

## Server vs Client Components

**Default to Server Components.** Only add `"use client"` when you need one of these:

| Trigger                                                | Example                            |
| ------------------------------------------------------ | ---------------------------------- |
| React hooks (`useState`, `useEffect`, `useTransition`) | Cart drawer quantity controls      |
| `usePathname()` / `useRouter()`                        | Active link styling, redirects     |
| Browser APIs                                           | `window.matchMedia` in mobile menu |
| Third-party client libraries                           | `@headlessui/react` Dialog, Menu   |
| Event handlers (`onClick`, `onChange`)                 | Delete button, form interactions   |

Components that don't need these stay as Server Components — they can be `async`, fetch data directly, and render with zero client JS.

### Project split

The project has ~17 Server Components and ~6 Client Components:

**Client** (`"use client"`): `AuthProvider`, `Logo`, `NavLink`, `MobileMenu`, `OrderList`, `UserMenu`, `CartDrawer`, `Overlay`

**Server** (including async): `Footer`, `Header`, `Nav`, `NavLinks`, `CartNavItem`, `ProductList`, `ProductElement`, `VariantSelector`, `AvailabilityMessage`, `Pagination`, `DraftModeNotification`

---

## Design Tokens

Use semantic Tailwind classes. The project uses Tailwind's neutral palette with status colors:

```tsx
// ✅ Good - consistent with project palette
<div className="bg-neutral-100 text-neutral-900 border-neutral-200">
<p className="text-neutral-500">  {/* Muted text */}
<span className="text-green-500"> {/* In stock */}
<span className="text-red-500">   {/* Out of stock / errors */}

// ❌ Bad - off-palette or hardcoded
<div className="bg-gray-100 text-black border-gray-300">
<div className="bg-[#f5f5f5]">
```

Key patterns from the codebase:

- **Backgrounds**: `bg-neutral-50`, `bg-neutral-100`, `bg-neutral-100/50` (with transparency for backdrop blur)
- **Text**: `text-neutral-900` (primary), `text-neutral-500` (secondary/muted)
- **Borders**: `border-neutral-200`, `border-neutral-300`
- **Interactive states**: `hover:bg-neutral-100`, `border-neutral-900` (active)

---

## Interactive Primitives

The project uses `@headlessui/react` for accessible interactive components, not shadcn/ui:

```tsx
// Menu (dropdown)
import { Menu } from "@headlessui/react";

<Menu as="div">
	<Menu.Button>{/* trigger */}</Menu.Button>
	<Menu.Items>{/* dropdown content */}</Menu.Items>
</Menu>;

// Dialog (modal/mobile menu)
import { Dialog, Transition } from "@headlessui/react";

<Dialog onClose={closeMenu}>
	<Transition show={isOpen}>{/* content */}</Transition>
</Dialog>;
```

Icons come from `lucide-react`:

```tsx
import { ShoppingBag, Trash2, Minus, Plus, User, Menu, X, Check } from "lucide-react";
```

---

## Export Pattern

If component is in a subdirectory, export from index:

```typescript
// src/ui/components/pdp/index.ts
export { NewComponent } from "./NewComponent";
```

---

## Anti-patterns

- **Don't add `"use client"` unless needed** — Check the trigger table above first
- **Don't use off-palette colors** — Stick to `neutral-*`, `green-500`, `red-500`
- **Don't use inline styles** — Use Tailwind classes
- **Don't install shadcn/ui** — The project uses @headlessui/react for interactive primitives
- **Don't use forwardRef** — The project uses plain function components
- **Don't fetch data in Client Components** — Move data fetching to a parent Server Component or use a Server Action
