# UI Design System

The token vocabulary an agent must use to build on-brand UI: color, typography, spacing/rhythm, page width, radius, elevation, motion, and the primitive variant matrix. This is the machine-readable grounding for any design work — read it before molding PDP, homepage, or any section.

> **Canonical human doc:** [`src/styles/README.md`](../../../src/styles/README.md) (rebrand workflow, full token table)
> **Tokens source of truth:** [`src/styles/brand.css`](../../../src/styles/brand.css) → mapped in [`tailwind.config.cjs`](../../../tailwind.config.cjs) > **Creating components / file locations:** [`ui-components.md`](ui-components.md) > **Design judgment (hierarchy, whitespace, mobile):** [`design-quality-rubric.md`](design-quality-rubric.md)

## First principle: design with tokens, not values

Realize a visual direction by **choosing tokens**, never by hardcoding hex, px, or one-off spacing. A rebrand edits `brand.css` once and the whole storefront follows. Hardcoded values silently break that contract and grow fork divergence.

```tsx
// ✅ token-backed
<section className="bg-muted py-section-md">
  <div className="container-content">…</div>
</section>

// ❌ hardcoded — invisible to rebrand, fails the hex-ban lint
<section style={{ background: "#f5f5f3", padding: "96px 0" }}>
```

## Color (semantic, OKLCH)

Use semantic Tailwind classes mapped to `brand.css` — never raw palette values.

| Intent                          | Classes                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------- |
| Page bg / text                  | `bg-background` / `text-foreground`                                           |
| Secondary text                  | `text-muted-foreground`                                                       |
| Cards, menus                    | `bg-card`                                                                     |
| Subtle panels                   | `bg-muted`, `bg-secondary`                                                    |
| Hover / active row              | `bg-accent`                                                                   |
| CTAs                            | `bg-primary text-primary-foreground`                                          |
| Sale / error                    | `text-destructive`, `bg-destructive` (use sale-label.tsx for sale UI)         |
| Borders                         | `border-border`                                                               |
| On dark bands (`bg-foreground`) | `text-inverse`, `text-inverse-subtle`, `text-inverse-muted`, `border-inverse` |

Light-only UI (no `.dark`). Optional editorial display font via `NEXT_PUBLIC_TYPOGRAPHY_THEME=editorial`.

## Typography (semantic, fluid)

Headings/marketing copy use **role tokens** sized with `clamp()` — no `md:text-4xl` breakpoint stacks. Always merge through `cn()` (size + color share the `text-*` prefix; the merge config registers these).

| Class          | Role                  | Mobile → desktop |
| -------------- | --------------------- | ---------------- |
| `text-display` | Homepage hero only    | 44 → 72px        |
| `text-h1`      | Page titles, PDP name | 32 → 48px        |
| `text-h2`      | Section headings      | 24 → 36px        |
| `text-h3`      | Card / column titles  | 18 → 24px        |
| `text-lead`    | Hero subheads, intros | 17 → 20px        |
| `text-eyebrow` | Overlines (uppercase) | 12px fixed       |

Default Tailwind sizes (`text-sm`, `text-lg`) remain for misc UI (price, breadcrumbs). Use role tokens for **roles**, not every node. Pair with `text-balance` (headings) / `text-pretty` (paragraphs).

## Page width (flexible — not a fixed desktop assumption)

Page width is a **design decision**. Paper does not assume a centered fixed-width desktop; full-bleed is first-class. Use the canonical container classes instead of bare `max-w-7xl`.

| Class               | Width | Use for                                       |
| ------------------- | ----- | --------------------------------------------- |
| `container-prose`   | 48rem | Long-form copy, legal, FAQ (readable measure) |
| `container-content` | 80rem | Default storefront body                       |
| `container-wide`    | 96rem | Immersive / editorial layouts                 |
| `container-full`    | 100%  | Full-bleed, edge-to-edge                      |

Each bundles `mx-auto w-full px-4 sm:px-6 lg:px-8`. Width-only utilities: `max-w-content`, `max-w-wide`. **Full-width ≠ full-measure text** — nest a `container-prose` inside `container-full`/`container-wide` so line length stays ~60–80ch.

```tsx
<section className="bg-foreground py-section-lg">
	<div className="container-full">
		<div className="container-prose text-inverse">…readable copy on a full-bleed band…</div>
	</div>
</section>
```

## Spacing & section rhythm

Layout spacing is normal Tailwind (`gap-4`, `grid-cols-2`). For **vertical rhythm between full-bleed bands**, use the fluid section tokens so cadence is consistent:

| Class           | Mobile → desktop | Use for                     |
| --------------- | ---------------- | --------------------------- |
| `py-section-sm` | 40 → 64px        | Compact bands               |
| `py-section-md` | 64 → 112px       | Standard marketing sections |
| `py-section-lg` | 80 → 144px       | Hero-adjacent feature bands |

Also available as `gap-section-*`, `mt-section-*`, etc.

## Radius, elevation, motion

| Concern   | Tokens                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Radius    | `rounded-md` (controls/inputs), `rounded-lg` (CTAs), `rounded-xl` (cards/media), `rounded-full` (pills) — driven by `--radius` |
| Elevation | `shadow-card` (resting), `shadow-elevated` (popovers/hover), `shadow-overlay` (sheets/modals)                                  |
| Motion    | `duration-fast` (150ms), `duration-base` (250ms), `duration-slow` (400ms); `ease-standard`, `ease-emphasized`                  |

Guard non-trivial motion with `motion-reduce:` / `prefers-reduced-motion`.

## Primitive variant matrix (cva)

Primitives in `src/ui/components/ui/` use [`class-variance-authority`](https://cva.style). Extend a variant by adding to the `cva` map — do not hand-roll new `cn()` conditionals or fork a primitive.

| Primitive    | Export                                        | Variants                                                        | Sizes                         |
| ------------ | --------------------------------------------- | --------------------------------------------------------------- | ----------------------------- |
| `button.tsx` | `Button`, `buttonClassName`, `buttonVariants` | `default`, `secondary`, `outline-solid`, `ghost`, `destructive` | `default`, `sm`, `lg`, `icon` |
| `badge.tsx`  | `Badge`, `badgeVariants`                      | `default`, `secondary`, `destructive`, `outline-solid`          | —                             |
| `sheet.tsx`  | `SheetContent`, `sheetVariants`               | side: `top`, `bottom`, `left`, `right`                          | —                             |

```tsx
import { Button } from "@/ui/components/ui/button";
<Button variant="secondary" size="lg">
	Shop now
</Button>;

// Token-backed link CTA (aria-disabled, not native disabled):
import { buttonClassName } from "@/ui/components/ui/button";
<Link className={buttonClassName({ asLink: true, size: "lg" })} href="/products">
	Browse
</Link>;
```

Adding a variant: edit the `cva` `variants` map in the primitive → it flows to `VariantProps` types automatically. For a brand-new size/intent shared across the app, prefer extending the existing primitive over a new component.

## Adding or changing a token (three files)

1. `src/styles/brand.css` — the `--token`.
2. `tailwind.config.cjs` — map it to a utility (`theme.extend`).
3. `src/lib/utils.ts` — register custom `text-*` size groups in `extendTailwindMerge` so `cn()` doesn't drop them.

Restart `next dev` after editing `tailwind.config.cjs`; `rm -rf .next` if JIT serves stale CSS.

## Anti-patterns

❌ Hardcoding hex/rgb/px or one-off spacing when a token exists — edit `brand.css` / use a token class
❌ Bare `max-w-7xl` for new page bodies — use `container-content` (or another width token)
❌ Full-bleed text with no inner `container-prose` — unreadable line length
❌ `md:text-4xl`-style breakpoint stacks on headings — use the fluid role tokens
❌ Hand-rolling a new primitive variant with `cn()` conditionals — extend the `cva` map
❌ Forgetting to register a new `text-*` size in `cn()` merge — the size class silently drops
