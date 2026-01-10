# Brand Customization

Quickly adapt the storefront's look to match any brand.

## Quick Start

Edit `src/styles/brand.css`:

```css
:root {
	/* Your brand's primary color */
	--brand: 37 99 235; /* Blue */
	--brand-foreground: 255 255 255;

	/* How rounded should things be? */
	--radius: 0.5rem;
}
```

Then rebuild: `pnpm build`

## What You Can Customize

### Brand Color

The primary accent color used for buttons, links, and highlights.

```css
--brand: 23 23 23; /* Default (dark) */
--brand: 37 99 235; /* Blue */
--brand: 22 163 74; /* Green */
--brand: 147 51 234; /* Purple */
--brand: 234 88 12; /* Orange */
```

### Neutral Palette

Background, text, and border colors. Generate a scale using tools like:

- [Tailwind Color Generator](https://uicolors.app/create)
- [Realtime Colors](https://realtimecolors.com/)

### Border Radius

Controls roundness of buttons, inputs, cards:

```css
--radius: 0; /* Sharp corners */
--radius: 0.25rem; /* Subtle rounding */
--radius: 0.5rem; /* Medium (default) */
--radius: 1rem; /* Very rounded */
```

### Font

Change the font in `src/app/layout.tsx`:

```tsx
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  variable: "--font-sans"
});

// In RootLayout:
<body className={font.variable}>
```

## Dark Mode

Dark mode is automatic via `dark:` classes in components.

The brand color in dark mode is configured separately:

```css
.dark {
	--brand: 250 250 250; /* Inverted for dark backgrounds */
	--brand-foreground: 23 23 23;
}
```

## Color Format

Colors use space-separated RGB values (not hex) to support opacity:

```css
--brand: 37 99 235; /* ✓ Correct */
--brand: #2563eb; /* ✗ Won't work with opacity */
```

This allows `bg-brand/50` for 50% opacity.

## Example: Blue Tech Brand

```css
:root {
	--brand: 37 99 235;
	--brand-foreground: 255 255 255;

	--neutral-50: 248 250 252;
	--neutral-100: 241 245 249;
	--neutral-200: 226 232 240;
	--neutral-300: 203 213 225;
	--neutral-400: 148 163 184;
	--neutral-500: 100 116 139;
	--neutral-600: 71 85 105;
	--neutral-700: 51 65 85;
	--neutral-800: 30 41 59;
	--neutral-900: 15 23 42;
	--neutral-950: 2 6 23;

	--radius: 0.5rem;
}

.dark {
	--brand: 96 165 250;
	--brand-foreground: 15 23 42;
}
```
