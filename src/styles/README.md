# Design tokens (`brand.css`)

**`src/styles/brand.css` is the single source of truth for visual design.**

Tailwind is how you apply tokens in components. `tailwind.config.cjs` maps CSS variables to utility classes — wire it once, don't edit it for rebrands.

```
brand.css  →  tailwind.config.cjs  →  className in components
     ↑
  edit here to rebrand
```

Copy and metadata (site name, tagline) live in `src/config/brand.ts`.

---

## Rebrand checklist

| Change                                | File                                                          |
| ------------------------------------- | ------------------------------------------------------------- |
| Colors, radius, inverted footer tones | `src/styles/brand.css`                                        |
| Site name, tagline, copyright, social | `src/config/brand.ts`                                         |
| Logo                                  | `public/logo.svg`, `public/logo-dark.svg` (inverted surfaces) |
| Favicons                              | `public/favicon*`                                             |

---

## Canonical Tailwind workflow

### 1. Edit tokens

```css
/* src/styles/brand.css */
:root {
	--primary: oklch(0.45 0.2 250); /* example: blue CTAs */
	--foreground: oklch(0.15 0.02 250);
	--background: oklch(0.98 0.005 90);
	--radius: 0.25rem;
}
```

### 2. Use semantic Tailwind classes

Prefer classes that resolve to a `var(--*)` from `brand.css` (mapped in `tailwind.config.cjs`). For brand colors and surfaces, this is the default path in this repo.

| Intent             | Classes                                                  |
| ------------------ | -------------------------------------------------------- |
| Page background    | `bg-background`                                          |
| Primary text       | `text-foreground`                                        |
| Secondary text     | `text-muted-foreground`                                  |
| Cards, menus       | `bg-card`                                                |
| Subtle panels      | `bg-muted`, `bg-secondary`                               |
| Hover / active row | `bg-accent`                                              |
| CTAs               | `bg-primary text-primary-foreground hover:bg-primary/90` |
| Borders            | `border-border`, `divide-border`                         |
| Sale / error       | `bg-destructive text-destructive-foreground`             |
| Corners            | `rounded-md`, `rounded-lg` (from `--radius`)             |

Layout and spacing stay normal Tailwind: `max-w-7xl`, `gap-4`, `grid-cols-2`, etc.

### 3. Inverted surfaces (footer)

Footer uses `bg-foreground text-background`. Muted text on that surface uses **on-foreground** tokens:

| Intent          | Classes                                                    |
| --------------- | ---------------------------------------------------------- |
| Column headings | `text-on-foreground`                                       |
| Links           | `text-on-foreground-subtle hover:text-on-foreground`       |
| Copyright       | `text-on-foreground-muted hover:text-on-foreground-subtle` |
| Divider         | `border-on-foreground`                                     |

### 4. Use UI primitives for repeated patterns

```tsx
import { Button } from "@/ui/components/ui/button";

<Button>Checkout</Button>;
```

Prefer `Button`, `Input`, `Badge` over hand-rolled color classes.

**Note:** Layout, spacing, and other non-brand utilities are still plain Tailwind. If you need a color that should change when `brand.css` changes, add or use a token — don't hardcode hex/rgb in components.

---

## Token reference

| Token                | Role                                        |
| -------------------- | ------------------------------------------- |
| `--background`       | Page background                             |
| `--foreground`       | Primary text                                |
| `--muted-foreground` | Secondary text                              |
| `--card`             | Elevated surfaces                           |
| `--muted`            | Subtle backgrounds, skeletons               |
| `--primary`          | CTAs                                        |
| `--destructive`      | Errors, sale badges                         |
| `--border`           | Dividers                                    |
| `--radius`           | Border radius scale                         |
| `--on-foreground*`   | Text on inverted (`bg-foreground`) surfaces |

Colors use **OKLCH**: `oklch(lightness chroma hue)` — lightness 0–1, hue 0–360.

---

## Why OKLCH?

Perceptually uniform lightness, predictable mixing, easier contrast tuning than hex.

---

## Related files

| File                   | Role                             |
| ---------------------- | -------------------------------- |
| `src/styles/brand.css` | Design tokens                    |
| `tailwind.config.cjs`  | Maps tokens → Tailwind utilities |
| `src/app/globals.css`  | Imports `brand.css`, base styles |
| `src/config/brand.ts`  | Site name, tagline, SEO copy     |
