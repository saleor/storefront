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
| Typography scale (fluid sizes)        | `src/styles/brand.css` + `tailwind.config.cjs` (see below)    |
| Site name, tagline, copyright, social | `src/config/brand.ts`                                         |
| Logo                                  | `public/logo.svg`, `public/logo-dark.svg` (inverted surfaces) |
| Favicons                              | `public/favicon*`                                             |
| OG image hex colors                   | `src/lib/seo/og-brand-colors.ts` (sync with `brand.css`)      |

**Light-only UI:** Storefront pages use the light theme only (no `.dark` class). Browser tab favicons in `src/lib/seo/metadata.ts` still follow `prefers-color-scheme` so icons stay readable on dark browser chrome — that is intentional and not an in-app dark mode.

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

Footer uses `bg-foreground text-background`. Text on that dark band uses **inverse** tokens (not `muted-foreground`, which is for light surfaces):

| Intent          | Classes                                        |
| --------------- | ---------------------------------------------- |
| Column headings | `text-inverse`                                 |
| Links           | `text-inverse-subtle hover:text-inverse`       |
| Copyright       | `text-inverse-muted hover:text-inverse-subtle` |
| Divider         | `border-inverse`                               |

### 4. Use UI primitives for repeated patterns

```tsx
import { Button } from "@/ui/components/ui/button";

<Button>Checkout</Button>;
```

Prefer `Button`, `Input`, `Badge` over hand-rolled color classes.

For primary-styled links (`<a>` / `<Link>`), use `buttonClassName({ asLink: true })` from `button.tsx`. Disabled links use `aria-disabled` — the default variant switches to `bg-muted text-muted-foreground` (solid, not opacity fade). Outline-style disabled links can use `ariaDisabledClassName`.

**Note:** Layout, spacing, and other non-brand utilities are still plain Tailwind. If you need a color that should change when `brand.css` changes, add or use a token — don't hardcode hex/rgb in components.

### 5. Sale labels

Use `sale-label.tsx` for all sale / discount UI — don't hand-roll `text-destructive` sale styles.

```tsx
import { SaleBadge, DiscountPercentLabel } from "@/ui/components/ui/sale-label";

<SaleBadge />                                    {/* "Sale" chip on card / PDP */}
<DiscountPercentLabel percent={20} />            {/* inline, next to price */}
<DiscountPercentLabel percent={20} size="pill" /> {/* variant option overlay */}
```

| Component                   | Use for                                      |
| --------------------------- | -------------------------------------------- |
| `SaleBadge`                 | Product on sale (image corner, PDP category) |
| `DiscountPercentLabel`      | `-X%` next to price or on variant options    |
| `Badge variant="secondary"` | Stock, status (not sale)                     |

Sale color is always `--destructive` (mapped to `text-destructive` / `border-destructive`).

### 6. Border radius

`--radius` (default `0.5rem`) drives `rounded-sm` / `rounded-md` / `rounded-lg` / `rounded-xl` in Tailwind. Use this hierarchy:

| Surface                         | Class          | Notes                                 |
| ------------------------------- | -------------- | ------------------------------------- |
| Buttons, inputs, nav controls   | `rounded-md`   | From `Button`, `Input`                |
| Marketing / empty-state CTAs    | `rounded-lg`   | Optional; links via `buttonClassName` |
| Product cards, media containers | `rounded-xl`   | PLP cards, gallery frames             |
| Pills (badges, swatch overlays) | `rounded-full` | `SaleBadge`, discount pills           |

Don't mix arbitrarily on the same component type.

### 7. Typography

Headings and marketing copy use **semantic type tokens** — same pattern as colors (`--foreground` → `text-foreground`).

```
brand.css (--text-h1, …)  →  tailwind.config.cjs (text-h1 utility)  →  className
                                      ↑
              weight / tracking / line-height defined here
```

| Token class    | Use for                             | Approx. size (mobile → desktop) |
| -------------- | ----------------------------------- | ------------------------------- |
| `text-display` | Homepage hero only                  | 44px → 72px                     |
| `text-h1`      | Page titles, PDP name, cart H1      | 32px → 48px                     |
| `text-h2`      | Section headings                    | 24px → 36px                     |
| `text-h3`      | Card/column titles                  | 18px → 24px                     |
| `text-lead`    | Hero subheads, intro paragraphs     | 17px → 20px                     |
| `text-eyebrow` | Brand labels, overlines (uppercase) | 12px fixed                      |

Sizes use `clamp()` in `rem` so they respect user font-size settings and scale fluidly — no `md:text-4xl` breakpoint stacks on headings.

**Pair with layout utilities:**

```tsx
<h1 className="text-balance text-h1 text-foreground">…</h1>
<p className="text-pretty text-lead text-muted-foreground">…</p>
<p className="text-eyebrow uppercase text-muted-foreground">Brand</p>
```

**Default Tailwind still works** (`text-sm`, `text-lg`, `text-2xl`, …) for misc UI — PDP price, breadcrumbs, cart line items. Use semantic tokens for **roles** (page title, section head), not every text node.

**Adding or changing a token** — update all three:

1. `src/styles/brand.css` — `--text-*` size variable (if fluid)
2. `tailwind.config.cjs` — `theme.extend.fontSize` entry (size + weight/tracking/leading)
3. `src/lib/utils.ts` — register the name in `extendTailwindMerge` so `cn("text-h1 text-foreground")` does not drop the size class

**`cn()` + colors:** Custom `text-*` size utilities share a prefix with `text-foreground`. Always merge heading classes through `cn()` — the merge config is already set up for `display`, `h1`, `h2`, `h3`, `lead`, `eyebrow`.

**Future:** On Tailwind v4, type tokens can move into `@theme` in `brand.css` and collapse the split between CSS variables and `tailwind.config.cjs`.

**Dev server / Tailwind config:** After changing `tailwind.config.cjs` (new `fontSize` tokens, plugins, etc.), restart the dev server. If utilities like `text-display` appear in HTML but render at body size, clear the webpack cache: `rm -rf .next` and restart. Tailwind JIT reads config at startup; stale `.next` can serve CSS from before the change.

---

## Token reference

| Token                                              | Role                                                      |
| -------------------------------------------------- | --------------------------------------------------------- |
| `--background`                                     | Page background                                           |
| `--foreground`                                     | Primary text                                              |
| `--muted-foreground`                               | Secondary text                                            |
| `--card`                                           | Elevated surfaces                                         |
| `--muted`                                          | Subtle backgrounds, skeletons                             |
| `--primary`                                        | CTAs                                                      |
| `--destructive`                                    | Errors, sale labels (`SaleBadge`, `DiscountPercentLabel`) |
| `--border`                                         | Dividers                                                  |
| `--radius`                                         | Border radius scale                                       |
| `--text-display` … `--text-lead`, `--text-eyebrow` | Fluid type scale + fixed eyebrow (see Typography)         |
| `--inverse*`                                       | Text/borders on inverse surfaces (`bg-foreground`)        |

Colors use **OKLCH**: `oklch(lightness chroma hue)` — lightness 0–1, hue 0–360.

---

## Why OKLCH?

Perceptually uniform lightness, predictable mixing, easier contrast tuning than hex.

---

## Related files

| File                   | Role                                                    |
| ---------------------- | ------------------------------------------------------- |
| `src/styles/brand.css` | Design tokens                                           |
| `tailwind.config.cjs`  | Maps tokens → Tailwind utilities                        |
| `src/lib/utils.ts`     | `cn()` / tailwind-merge (typography token registration) |
| `src/app/globals.css`  | Imports `brand.css`, base styles                        |
| `src/config/brand.ts`  | Site name, tagline, SEO copy                            |
