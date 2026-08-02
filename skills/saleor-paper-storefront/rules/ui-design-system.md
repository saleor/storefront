---
name: ui-design-system
description: The token vocabulary: OKLCH semantic color, typography role tokens, page-width containers, spacing/rhythm, radius/elevation/motion, cva variant matrix. Read before any visual/design work; tokens live in src/styles/brand.css.
---

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

**Keep the palette to ~3–5 colors.** A premium palette is small: **one** primary/brand color + the neutral ramp (background/foreground/greys) + **1–2** accents (e.g. `bestseller`, sale). Don't exceed ~5 meaningful colors without a deliberate reason — more colors read as noise, not richness.

**Don't default to purple/violet.** It's the generic "AI-generated" tell. Use it only when the brand or reference genuinely calls for it — never as a fallback brand color.

**Changing a background means changing its text.** Never set a surface color without its paired foreground. Use the token _pairs_ so contrast is automatic — `bg-primary`→`text-primary-foreground`, `bg-foreground`→`text-inverse*`, `bg-card`→`text-card-foreground`. Don't hand-pick a text color against a new background.

**Spend brand color by tier (Brand Influence Policy).** Having a token does not mean painting it with brand color. The shell stays neutral; brand color is reserved for **Tier-1 signature** slots (`primary`/CTAs, focus emphasis, links, bestseller/sale badges, selected states). Backgrounds, cards, borders, muted panels and text are a **neutral ramp** — they take at most a whisper of hue, and only when a `tinted`/`bold` surface strategy is deliberately chosen. `destructive`/`success` stay true red/green. See [`design-quality-rubric`](design-quality-rubric.md#the-brand-influence-policy--spend-brand-color-by-tier) for the full tier table, surface strategy, and section rhythm, and [`design-from-image`](design-from-image.md#borrowing-colors-from-a-reference-with-restraint) for borrowing reference colors into OKLCH tokens.

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

| Class                  | Width  | Use for                                                                      |
| ---------------------- | ------ | ---------------------------------------------------------------------------- |
| `container-prose`      | 48rem  | Long-form copy, legal, FAQ (readable measure)                                |
| `container-content`    | 80rem  | Default storefront body                                                      |
| `container-wide`       | 96rem  | Editorial marketing bands (not default PDP body)                             |
| `container-super-wide` | 160rem | **Immersive PDP only** — full-bleed up to 2560px, capped on ultrawide        |
| `container-full`       | 100%   | True edge-to-edge at **every** viewport width (no max)                       |
| `container-nav`        | token  | Header bar + mega-menu column (`--container-nav`, defaults to content width) |

Each bundles `mx-auto w-full px-4 sm:px-6 lg:px-8`. Width-only utilities: `max-w-content`, `max-w-wide`, `max-w-super-wide`. **Full-width ≠ full-measure text** — nest a `container-prose` inside wide/full bands so line length stays ~60–80ch.

### Full-bleed nuance (`super-wide` vs `full`)

For "full bleed" / "immersive edge-to-edge" requests, **default to `container-super-wide`**: it's `100%` up to 160rem (2560px) then centers — full-bleed on every normal monitor, but capped so product imagery doesn't stretch absurdly on ultrawide/4K. Reserve `container-full` (never caps) for rare brand moments that must touch the bezel at any resolution. Tune the cap via `--container-super-wide` in `brand.css`; override immersive PDP via `PDP_LAYOUT_CLASSES.immersive.main` in `gallery-layout.ts`.

**Two width knobs are brand-level, no component edits, reversible:**

- **Nav** — header + mega-menu use `container-nav` (`--container-nav`, default `--container-content`). Set it to `--container-full`/`--container-wide` to take the nav edge-to-edge.
- **Body** — every page body (PDP, PLP, search, cart, CMS, collections/categories, footer, skeletons) uses `container-content`, so `--container-content` is the single body-width token. Widen it globally for a consistent wider frame, or swap one page's wrapper to a wider container for a one-off.

(The checkout surface keeps its own `max-w-7xl` frame by design — separate surface, must not share storefront layout tokens.)

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

| Concern   | Tokens                                                                                                                                                                                                                                                                                                                                                         |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Radius    | `rounded-button` (buttons/CTAs ← `--radius-button`), `rounded-card` (cards/tiles/media ← `--radius-card`), plus the base `--radius` scale (`rounded-sm/md/lg/xl`). `rounded-full` stays for genuinely circular UI (avatars, dots). Re-shape the whole UI (e.g. pill buttons, hard-edged cards) by editing the shape tokens in `brand.css` — no component edits |
| Elevation | `shadow-card` (resting), `shadow-elevated` (popovers/hover), `shadow-overlay` (sheets/modals)                                                                                                                                                                                                                                                                  |
| Motion    | `duration-fast` (150ms), `duration-base` (250ms), `duration-slow` (400ms); `ease-standard`, `ease-emphasized`                                                                                                                                                                                                                                                  |

Guard non-trivial motion with `motion-reduce:` / `prefers-reduced-motion`.

## Expressive layer (opt-in, Tier-2 — define as tokens, never inline)

Some brands _do_ call for richer surfaces — a gradient hero band, a softer elevated hover, a signature motion. That's legitimate **Tier-2 structural** expression, governed by two rules:

1. **It lives in `brand.css` as a token** (e.g. `--gradient-hero`, `--shadow-elevated-brand`, `--ease-signature`), mapped in `tailwind.config.cjs` — never an inline `style`/one-off, so a rebrand still flows from one place.
2. **It's opt-in and contained** — on the same deliberate surfaces the influence policy allows a color band (~1 in 3–4 sections; a hero; a feature CTA), never the neutral shell or product surfaces.

Gradient discipline (if used): subtle accent only, analogous hues, 2–3 stops max — never on interactive elements or behind product media. **Hard nos:** glow shadows, neon/text drop-shadows, rainbow/high-contrast gradients on body surfaces. Restraint is the house style — see [`design-quality-rubric`](design-quality-rubric.md) for the full judgment.

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
