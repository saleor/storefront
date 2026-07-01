---
name: design-from-image
description: Turning a prompt/screenshot/reference into Paper UI by reconfiguring tokens and composing existing sections (not cloning markup). Use when designing from an image or 'make it look like X'.
---

# Design From Prompt or Image

How to turn a user's prompt, reference screenshot, mockup, or "make it look like X" into Paper UI — by reconfiguring the design system, not bypassing it. This is the generative workflow that ties the design rules together.

> Read together with [`ui-design-system`](ui-design-system.md) (tokens), [`ui-sections`](ui-sections.md) (blocks), [`page-composition`](page-composition.md) (PPR rails), [`design-quality-rubric`](design-quality-rubric.md) (the bar).
> **Act as a world-class ecommerce designer** (see the rubric's opening directive): reproduce the _spirit_, with restraint. A reference that's loud everywhere should still become a tasteful, premium store, not a literal repaint.
> Core stance: **reproduce the design's spirit by adjusting tokens and composing existing blocks** — not by hardcoding values or cloning markup pixel-for-pixel. This keeps output on-brand, performant, accessible, and low-divergence.

## Workflow

### 0. Audit & confirm scope (redesign-from-reference only)

When the task is to **redesign an existing surface to match a reference** (screenshot, URL, or "make X look like Y") — not building net-new and not a small, well-specified edit — do this before writing any code:

1. **Read both sides.** Read the reference for intent (Step 1 signals) and read the current implementation of the target surface (its page file + section/component tree).
2. **Produce a categorized gap analysis**, grouping differences into:
   - **Information architecture** — hierarchy, ordering, density, what leads the page.
   - **Missing elements** — present in the reference, absent in ours (impact band, reviews summary, size guide, etc.).
   - **Media / gallery** — how imagery is presented.
   - **Third-party** — external widgets/integrations implied (reviews, etc.).
3. **Confirm scope with the developer.** Present the gaps and ask which to build (a short multiple-choice is ideal). Do not start editing until scope is confirmed.

Skip this gate for small, well-specified changes ("switch to the editorial theme", "reorder the buy box") — proceed directly to Step 1.

> Why: keeps large redesigns intentional and developer-driven, and avoids over-building sections the merchant did not ask for.

### 1. Brief — extract intent before writing code

From the prompt/image, write a short internal design brief (and ask 1–3 questions only if genuinely blocked):

- **Surface & scope**: homepage? PDP? a single section? full redesign?
- **Layout structure**: section stack, columns, and **width intent per band** (centered `content`, immersive `wide`, or `full`-bleed). Note that full-width is allowed.
- **Type personality**: geometric/neutral (Geist) vs editorial/serif (Fraunces editorial theme); display scale usage.
- **Palette direction & surface strategy**: decide the shell first — `clean` (white/near-white, the premium default), `tinted` (subtle brand ground), or `bold` (colored shell, cards stay near-white). Then pick the **accent** the brand spends on Tier-1 only (CTA, badges, links). Don't tint the whole shell to match a colorful reference — that's the template trap (see the rubric's Brand Influence Policy). Light-only.
- **Density & rhythm**: airy vs compact (maps to `py-section-sm/md/lg`).
- **Imagery role**: photography-led? product-forward? editorial?
- **Mobile intent**: how the structure collapses to one column (it must — see rubric).

If the user supplied an image, read it for these signals; don't transcribe its exact pixels.

### 2. Map to the design system (not to raw values)

Translate the brief into **token and component decisions**:

| From the reference                            | Map to                                                                                                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Shell mood (bg/text)                          | Pick a **surface strategy** (clean/tinted/bold); keep the neutral ramp neutral unless tinted/bold is deliberate |
| Brand / accent color                          | Tier-1 only: `--primary` (+ `--bestseller`/sale). Adjust in `brand.css` (OKLCH) — never per-component hex       |
| Type personality                              | Choose default vs editorial typography theme; use role tokens (`text-display/h1/h2…`)                           |
| Corner softness                               | `--radius`                                                                                                      |
| Spacing density                               | `py-section-*` choice + spacing tokens                                                                          |
| Layout width                                  | `container-prose/content/wide/full` per band                                                                    |
| Elevation / depth                             | `shadow-card/elevated/overlay`                                                                                  |
| Sections (hero, split, columns, grid, quote…) | Pick from the `ui-sections` catalog                                                                             |

A whole-store restyle is mostly a `brand.css` edit + section selection — that is the point.

#### Borrowing colors from a reference (with restraint)

When the reference gives you concrete colors (swatches, an image, a brand site), map them onto tokens **by tier**, never by repainting the shell:

1. **Pick the shell first** — usually `clean` (keep `--background`/`--foreground` neutral). Choose `tinted`/`bold` only if the reference is _deliberately_ colored and you commit to it (cards/product stay near-white).
2. **Extract only the signature color(s)** — the brand's CTA/accent hue (sometimes a secondary for badges). Ignore the dozens of incidental colors in a screenshot.
3. **Convert to OKLCH channels** — brand.css needs bare `"L C H"`, which you can't eyeball. Use the helper:

```bash
node scripts/brand/color.mjs "#1466b3" "#f08c1d"
# 1466b3 -> 0.5064 0.1424 252.3   → paste into --primary
# f08c1d -> 0.7318 0.1628 60.7    → paste into --bestseller
```

4. **Assign to Tier-1 only** — `--primary` (+ `--bestseller`/sale). Leave the neutral ramp and semantic `--destructive`/`--success` alone. See the rubric's Brand Influence Policy.

This is the whole "match a reference's color" job — a couple of OKLCH tokens, not a brand-DNA exercise.

### 3. Select & compose existing blocks first

- Match each region of the reference to a catalog section (`HeroBanner`, `ImageWithText`, `MulticolumnSection`, `FeaturedCollectionSection`, `RichTextBlock`).
- Use section variant props (`height`, `imagePosition`, `columnsDesktop`, `align`, `width`) to approximate the reference.
- Only author a **new** section when nothing fits — follow the section pattern in `ui-sections` (full-bleed band + width container, tokens, Server Component, skeleton if it streams). Add it to the catalog.

### 4. Compose the page within the PPR rails

- Assemble in the page file per [`page-composition`](page-composition.md): static design in the cached shell, runtime/searchParams/cookie UI in nested Suspense islands.
- Pull copy from `getStorefrontContent()` / next-intl — placeholder copy only as a temporary stand-in, then wire the content model.
- Keep LCP and the mobile sticky CTA intact on PDP.

### 5. Verify (the autofixer loop)

Run the [`design-quality-rubric`](design-quality-rubric.md) self-check, then the [`design-verification`](design-verification.md) gates:

- `pnpm exec tsc --noEmit`; build for PPR-sensitive changes.
- Hex-ban lint (token-only), unnecessary-`"use client"` check, mobile/overflow/tap-target review.
- Optionally invoke the `web-design-guidelines` skill for an accessibility/UX audit pass.
- Compare against the brief (not the pixels): same hierarchy, mood, density, width intent — and excellent on mobile.

## Worked example (prompt → plan)

> "Make the homepage feel like a high-end editorial fashion store — big imagery, lots of whitespace, full-width hero, serif headlines."

1. **Brief**: homepage; full-bleed hero, generous rhythm; editorial/serif type; neutral palette, photography-led; airy density.
2. **Tokens**: enable editorial typography theme (Fraunces display); keep neutral OKLCH palette, maybe warm `--background`; `py-section-lg` rhythm.
3. **Blocks**: `HeroBanner height="large"` with `backgroundImage` (full-bleed) → `FeaturedCollectionSection` → `ImageWithText` (alternating) → `RichTextBlock width="narrow"` for the brand note.
4. **Compose**: hero/editorial in the shell, featured grid streaming in Suspense; widths: hero `full`, story `content`, an editorial band `wide` with inner `prose`.
5. **Verify**: rubric self-check (one display element, readable measure inside full-bleed, mobile single-column, tap targets), then gates.

## Anti-patterns

❌ Repainting the whole shell to match a colorful reference (tinted backgrounds/cards everywhere) instead of a clean shell + Tier-1 accent — the template trap
❌ Hardcoding the reference's exact hex/px/fonts into components instead of adjusting tokens
❌ Cloning a screenshot's markup pixel-for-pixel (brittle, off-brand, unmaintainable) — reproduce intent via the system
❌ Inventing new primitives/sections when a catalog block + variant would do
❌ Ignoring the PPR layer model to get a layout "looking right" (breaks caching/LCP)
❌ Shipping a desktop-accurate clone that breaks on mobile — mobile excellence is non-negotiable
❌ Leaving placeholder copy hardcoded instead of wiring the content layer
❌ Skipping the rubric self-check and gates before declaring done
