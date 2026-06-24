# Design Quality Rubric

The bar for "world-class" when molding storefront surfaces (PDP, homepage, marketing sections). Use this to make design decisions and to self-review before finishing. Pairs with [`ui-design-system`](ui-design-system.md) (the token vocabulary) and [`page-composition`](page-composition.md) (the architecture rails).

> **Always act as a world-class ecommerce designer.** Before any visual work, step into the role of a senior product designer at a top commerce studio (Aesop, SSENSE, Apple, Glossier, Hermès, Cotopaxi). Hold every screen to that bar: confident typography, generous and intentional whitespace, a **restrained palette**, and photography-led hierarchy. **Restraint reads as premium — when in doubt, remove.** A page that looks "branded everywhere" looks like a template; a page that looks expensive spends its brand budget deliberately.
> For an external accessibility/UX audit pass, invoke the `web-design-guidelines` skill.

## The principles

### 1. Hierarchy — one clear focal point per view

Every screen has a single most-important element (hero headline, product image, price + CTA). Establish hierarchy with **size, weight, space, and color** — in that order. Don't compete: one display size per page (`text-display` is homepage-hero-only), one primary CTA per view.

### 2. Typography — disciplined, not decorative

- Use the role tokens (`text-display/h1/h2/h3/lead`). Don't invent sizes.
- One typeface family for headings, one for body (Paper ships Geist; editorial theme adds Fraunces display). Never introduce a third.
- Body/measure: keep line length ~60–80ch (`container-prose` / `max-w-prose`) even inside full-bleed bands.
- Limit weights (regular + medium/semibold + the token-baked heading weights). Avoid faux-bold stacks.
- `text-balance` for headlines, `text-pretty` for paragraphs.

### 3. Whitespace & rhythm — let it breathe

- Whitespace is a feature, not waste. Prefer more space around focal elements.
- Use the section rhythm tokens (`py-section-sm/md/lg`) for vertical cadence — consistent spacing between bands is the strongest signal of polish.
- Align to a consistent grid; keep gutters consistent (the container classes own them).

### 4. Color & contrast — restrained, semantic, accessible

- Lean on neutrals; use `--primary`/`--destructive` sparingly for action and emphasis.
- **Keep to ~3–5 colors**: one primary/brand + the neutral ramp + 1–2 accents. Don't default to purple/violet (the generic "AI" tell) unless the brand calls for it.
- Token-only (see `ui-design-system`). Body text ≥ 4.5:1, large text / UI ≥ 3:1. On `bg-foreground` bands use `text-inverse*`; change a background only via its paired foreground token.

#### The Brand Influence Policy — spend brand color by tier

Not every element deserves brand color. Each token carries an explicit "expression budget." This is what separates a premium store from a recoloured template:

| Tier                  | Elements                                                                                               | Brand influence                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **1 — Signature**     | Primary CTA (`bg-primary`), focus emphasis, links, bestseller/sale badges, selected/active states      | **Full accent.** These — and only these — carry the saturated brand hue.                                                             |
| **2 — Structural**    | Radius, typography (`--radius`, display font)                                                          | **Full, free.** Personality is cheap and safe here; let shape + type do most of the "feel."                                          |
| **3 — Neutral shell** | `background`, `card`, `popover`, `muted`, `secondary`, `accent`, `border`, `input`, all `*-foreground` | **Near-zero.** Stay a high-contrast neutral grayscale. At most a _whisper_ of hue, and only via a deliberate surface choice (below). |

Semantic colors (`destructive` error, `success`) stay true red/green — they're trust signals, not brand paint. Focus rings stay neutral chrome for consistency.

#### Surface strategy — the background decision is deliberate, not automatic

Most world-class stores use a **white/near-white** ground and reserve color for Tier 1. Going colored is a _choice_, not a default:

- **Clean** (default, ~90% of premium commerce): white/near-white shell, near-black text, color only on signature slots. SSENSE, Apple, Glossier, Cotopaxi.
- **Tinted**: a deliberate, very subtle brand-tinted ground (still light, capped chroma). Aesop, Le Labo.
- **Bold**: a confident colored/dark shell — but keep **product surfaces (cards/media) near-white** so the product stays the hero. Use rarely and commit fully.

#### Section accent rhythm — which sections may take color

Keep most bands on the neutral ground. Reserve color/contrast for rhythm: **at most ~1 in 3–4 sections** becomes a dark (`bg-foreground`) or brand (`bg-primary`) "feature" band — a hero, a values/CTA band, an editorial break. Product media always sits on a neutral surface. One bold moment reads as confident; bold everywhere reads as noise.

> Apply this whether you're steering prompt-by-prompt or matching a reference: keep the neutral ramp neutral, choose a surface strategy deliberately, and route brand color to Tier-1 only. For borrowing exact colors from a reference into OKLCH tokens, see [`design-from-image`](design-from-image.md#borrowing-colors-from-a-reference-with-restraint).

### 5. Imagery — the product is the hero

- Commerce is photography-led. Give images room; use consistent aspect ratios within a view (`aspect-square` / `aspect-[4/5]` for product media).
- Always `next/image` with correct `sizes`; `priority` only on the LCP image. Provide meaningful `alt` (empty `alt=""` only for purely decorative).
- Never let layout shift on image load (reserve space via aspect ratio).

### 6. Motion — subtle, purposeful, optional

- Micro-interactions only (hover, focus, reveal). Use `duration-fast/base` + `ease-standard`.
- Always honor `motion-reduce:`. Motion must never gate content or be required to understand the page.

### 7. Layout width is a deliberate choice — full-width is allowed

Paper does **not** assume a fixed centered desktop width. Choose width per intent and state it:

- Editorial / immersive PDP or homepage → `container-wide` or `container-full` bands are encouraged.
- Reading-heavy content → `container-prose`.
- Standard catalog body → `container-content`.

A full-bleed desktop layout is a valid, premium choice — but **constrain text measure** within it and never let full-width leak into broken mobile (see below).

## Mobile non-negotiables (NEVER compromise)

Mobile is the majority of commerce traffic. A design is not done until mobile is excellent. These are hard requirements, not preferences:

- **No horizontal scroll / overflow** at 320–430px width. Test the narrowest case.
- **Tap targets ≥ 44×44px**; adequate spacing between interactive elements (no fat-finger ambiguity).
- **No hover-only affordances** — anything reachable on hover must be reachable on tap/focus.
- **Fluid type** via the `clamp()` role tokens — no tiny fixed text, no breakpoint jumps.
- **Mobile-first composition**: design the single-column mobile view first; desktop _adds_ columns/width. Don't design desktop then cram it down.
- **Primary action stays reachable**: PDP uses the sticky add-to-cart bar (`sticky-bar.tsx`) — preserve that pattern; don't bury the CTA.
- **Correct input ergonomics**: `inputmode`, `autocomplete`, real `<label>`s on any form field.
- **Performance is UX on mobile**: keep client JS minimal (Server Components by default), reserve image space, lazy-load below-the-fold media.

Going full-width on desktop must not remove mobile gutters or rhythm — the container/section tokens own the mobile contract; use them rather than ad-hoc widths.

## Self-check before finishing

Run this checklist (and fix what fails) before considering a design done:

- [ ] One clear focal point; one primary CTA per view.
- [ ] Only role typography tokens; one display element; readable measure (~60–80ch) everywhere, including full-bleed.
- [ ] Vertical rhythm uses `py-section-*`; spacing feels consistent and generous.
- [ ] Color/spacing/radius/shadow are token-backed — zero hardcoded hex/px.
- [ ] **Brand budget spent by tier**: shell/chrome stays neutral; brand color appears only on Tier-1 signature slots; surface strategy (clean/tinted/bold) is intentional; ≤ ~1 in 3–4 sections takes a color/dark band.
- [ ] Images: `next/image`, correct `sizes`, `priority` only on LCP, consistent aspect ratios, no CLS, meaningful `alt`.
- [ ] **Mobile (320–430px): no horizontal scroll; tap targets ≥44px; no hover-only; CTA reachable; single-column reads well.**
- [ ] Width choice is intentional (`prose`/`content`/`wide`/`full`) and stated.
- [ ] Motion is subtle and `motion-reduce`-guarded.
- [ ] Server Component by default; `"use client"` only where interactivity demands it (see `page-composition`).
- [ ] Reused existing primitives/sections where they fit; new components follow the section pattern and tokens.
- [ ] Accessibility: focus-visible states, heading order (one `h1`), contrast — consider a `web-design-guidelines` pass.

## Anti-patterns

❌ Branding the shell — tinting backgrounds/cards/borders or coloring most sections (template look). Keep neutrals neutral; reserve brand color for Tier-1 slots
❌ Mistaking "beautiful" for "loud" — glow shadows, neon gradients, gradient-behind-product, maximalist color. Beauty here = crafted typography, space, and restraint, expressed through a customized design system (rich treatments are opt-in Tier-2 tokens, not defaults)
❌ Multiple competing focal points / multiple `text-display` per page
❌ More than two type families, or faux-bold weight stacks
❌ Cramped vertical rhythm or inconsistent section spacing
❌ Designing desktop-first then shrinking — always mobile-first
❌ Full-width layouts with unconstrained text measure
❌ Hover-only menus/actions, tap targets < 44px, horizontal overflow on mobile
❌ Decorative motion that blocks content or ignores `prefers-reduced-motion`
❌ Reaching for hardcoded values or new primitives instead of tokens/existing components
