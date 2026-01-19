# Brand Configuration

All brand styling is defined in `brand.css` using CSS custom properties with OKLCH color values.

## Design Philosophy

**3-Color System:**

1. **Near-black** (`#1A1A1A`) - Primary actions, headings, key UI
2. **Warm off-whites** (`#FAF9F7` → `#F5F4F2` → `#E5E4DF`) - Backgrounds with subtle warmth
3. **Red accent** (`#DC2626`) - Only for destructive actions and sale indicators

The palette uses warm undertones (OKLCH hue 90 = subtle yellow) to feel premium and approachable rather than cold/sterile. This minimal approach keeps focus on product imagery.

## Color Tokens

### Light Mode

| Token                  | OKLCH                  | Hex       | Usage                        |
| ---------------------- | ---------------------- | --------- | ---------------------------- |
| `--background`         | `oklch(0.98 0.005 90)` | `#FAF9F7` | Main page background         |
| `--card`               | `oklch(1 0 0)`         | `#FFFFFF` | Cards, modals                |
| `--secondary`          | `oklch(0.96 0.003 90)` | `#F5F4F2` | Secondary backgrounds        |
| `--muted`              | `oklch(0.94 0.003 90)` | `#EFEEE9` | Disabled, subtle backgrounds |
| `--foreground`         | `oklch(0.12 0 0)`      | `#1A1A1A` | Primary text                 |
| `--muted-foreground`   | `oklch(0.45 0 0)`      | `#737373` | Secondary text               |
| `--primary`            | `oklch(0.12 0 0)`      | `#1A1A1A` | Buttons, CTAs                |
| `--primary-foreground` | `oklch(0.98 0 0)`      | `#FAFAFA` | Text on primary              |
| `--border`             | `oklch(0.9 0.003 90)`  | `#E5E4DF` | Borders, dividers            |
| `--destructive`        | `oklch(0.55 0.2 25)`   | `#DC2626` | Errors, sale badges          |

## Usage in Components

```tsx
// Backgrounds
<div className="bg-background">      // Main page
<div className="bg-card">            // Cards, modals
<div className="bg-secondary">       // Secondary areas
<div className="bg-muted">           // Subtle/disabled

// Text
<p className="text-foreground">      // Primary text
<p className="text-muted-foreground"> // Secondary text

// Buttons
<button className="bg-primary text-primary-foreground">

// Borders (default uses --border)
<div className="border">

// Destructive/Sale
<span className="bg-destructive text-destructive-foreground">Sale</span>
```

## Customization

To change the brand colors:

1. Edit `brand.css`
2. Modify the OKLCH values in `:root`
3. Update dark mode values in `.dark` if needed

### Example: Blue Brand

```css
:root {
	--primary: oklch(0.45 0.2 250); /* Blue */
	--primary-foreground: oklch(0.98 0 0);
	--ring: oklch(0.45 0.2 250);
}
```

## Why OKLCH?

OKLCH provides perceptually uniform colors, meaning:

- Consistent perceived lightness across hues
- Predictable color mixing
- Better for accessibility (contrast calculations)

Format: `oklch(lightness chroma hue)`

- Lightness: 0 (black) to 1 (white)
- Chroma: 0 (gray) to ~0.4 (vivid)
- Hue: 0-360 degrees (0=pink, 90=yellow, 180=cyan, 270=blue)
