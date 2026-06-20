/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			// Colors are `oklch(var(--token) / <alpha-value>)` so opacity modifiers work
			// (bg-foreground/40, text-background/80, gradient scrims). Tokens in brand.css
			// are BARE channels (`L C H`) for this reason — never finished colors.
			colors: {
				background: "oklch(var(--background) / <alpha-value>)",
				foreground: "oklch(var(--foreground) / <alpha-value>)",
				card: {
					DEFAULT: "oklch(var(--card) / <alpha-value>)",
					foreground: "oklch(var(--card-foreground) / <alpha-value>)",
				},
				popover: {
					DEFAULT: "oklch(var(--popover) / <alpha-value>)",
					foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
				},
				primary: {
					DEFAULT: "oklch(var(--primary) / <alpha-value>)",
					foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
					foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "oklch(var(--muted) / <alpha-value>)",
					foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
				},
				accent: {
					DEFAULT: "oklch(var(--accent) / <alpha-value>)",
					foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
					foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
				},
				success: {
					DEFAULT: "oklch(var(--success) / <alpha-value>)",
					foreground: "oklch(var(--success-foreground) / <alpha-value>)",
				},
				bestseller: "oklch(var(--bestseller) / <alpha-value>)",
				border: "oklch(var(--border) / <alpha-value>)",
				input: "oklch(var(--input) / <alpha-value>)",
				ring: "oklch(var(--ring) / <alpha-value>)",
				inverse: {
					DEFAULT: "oklch(var(--inverse) / <alpha-value>)",
					subtle: "oklch(var(--inverse-subtle) / <alpha-value>)",
					muted: "oklch(var(--inverse-muted) / <alpha-value>)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				xl: "calc(var(--radius) + 4px)",
				// Component-shape tokens (brand.css). Use rounded-button / rounded-card so
				// button + card corners are driven from one place, not hardcoded per component.
				button: "var(--radius-button)",
				card: "var(--radius-card)",
			},
			// Named page-width tokens (brand.css). `max-w-content` is the canonical body
			// width; `max-w-wide` for immersive layouts. Full-bleed = `max-w-full` (default).
			// Note: Tailwind's default `max-w-prose` (65ch) is intentionally left intact —
			// the prose container width is exposed via the `.container-prose` class instead.
			maxWidth: {
				content: "var(--container-content)",
				wide: "var(--container-wide)",
			},
			// Fluid section rhythm — usable anywhere spacing applies (py-section-md, gap-section-lg, …).
			spacing: {
				"section-sm": "var(--section-space-sm)",
				"section-md": "var(--section-space-md)",
				"section-lg": "var(--section-space-lg)",
			},
			boxShadow: {
				card: "var(--shadow-card)",
				elevated: "var(--shadow-elevated)",
				overlay: "var(--shadow-overlay)",
			},
			transitionDuration: {
				fast: "var(--duration-fast)",
				base: "var(--duration-base)",
				slow: "var(--duration-slow)",
			},
			transitionTimingFunction: {
				standard: "var(--ease-standard)",
				emphasized: "var(--ease-emphasized)",
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
				mono: ["var(--font-geist-mono)", "monospace"],
			},
			// Semantic type scale — fluid sizes from brand.css with weight/tracking/leading
			// baked in. Use `text-display`/`text-h1`/`text-h2`/`text-h3`/`text-lead`/`text-eyebrow`
			// instead of stacking `text-3xl font-semibold tracking-tight md:text-4xl`.
			// Format: [fontSize, { lineHeight, letterSpacing, fontWeight }]
			fontSize: {
				display: ["var(--text-display)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "700" }],
				h1: ["var(--text-h1)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
				h2: ["var(--text-h2)", { lineHeight: "1.12", letterSpacing: "-0.015em", fontWeight: "600" }],
				h3: ["var(--text-h3)", { lineHeight: "1.25", letterSpacing: "-0.005em", fontWeight: "600" }],
				lead: ["var(--text-lead)", { lineHeight: "1.55" }],
				eyebrow: ["var(--text-eyebrow)", { lineHeight: "1.4", letterSpacing: "0.1em", fontWeight: "600" }],
			},
			borderColor: {
				DEFAULT: "oklch(var(--border) / <alpha-value>)",
				inverse: "oklch(var(--border-inverse) / <alpha-value>)",
			},
			ringColor: {
				DEFAULT: "oklch(var(--ring) / <alpha-value>)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"skeleton-fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"cart-badge-pop": {
					"0%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.4)" },
					"100%": { transform: "scale(1)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				// Delayed skeleton: invisible for 250ms, then fades in over 200ms
				// Prevents flash on fast loads while still showing feedback on slow loads
				"skeleton-delayed": "skeleton-fade-in 0.2s ease-in 0.25s forwards",
				// Longer delay for route-level loading (400ms)
				"skeleton-delayed-long": "skeleton-fade-in 0.2s ease-in 0.4s forwards",
				// Cart badge pop when item count increases
				"cart-badge-pop": "cart-badge-pop 0.3s ease-out",
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
		require("@tailwindcss/container-queries"),
		require("tailwindcss-animate"),
	],
};
