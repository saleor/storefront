import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";

/**
 * Tailwind Configuration
 *
 * Brand customization: edit src/styles/brand.css
 * That file controls colors, border radius, and other brand-specific values.
 */
const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				/* Brand colors - customizable via CSS variables in brand.css */
				brand: {
					DEFAULT: "rgb(var(--brand) / <alpha-value>)",
					foreground: "rgb(var(--brand-foreground) / <alpha-value>)",
				},

				/* Neutral scale - customizable via CSS variables in brand.css */
				neutral: {
					50: "rgb(var(--neutral-50) / <alpha-value>)",
					100: "rgb(var(--neutral-100) / <alpha-value>)",
					200: "rgb(var(--neutral-200) / <alpha-value>)",
					300: "rgb(var(--neutral-300) / <alpha-value>)",
					400: "rgb(var(--neutral-400) / <alpha-value>)",
					500: "rgb(var(--neutral-500) / <alpha-value>)",
					600: "rgb(var(--neutral-600) / <alpha-value>)",
					700: "rgb(var(--neutral-700) / <alpha-value>)",
					800: "rgb(var(--neutral-800) / <alpha-value>)",
					900: "rgb(var(--neutral-900) / <alpha-value>)",
					950: "rgb(var(--neutral-950) / <alpha-value>)",
				},

				/* Feedback colors - static, rarely need brand customization */
				success: {
					50: "#f0fdf4",
					100: "#dcfce7",
					200: "#bbf7d0",
					300: "#86efac",
					400: "#4ade80",
					500: "#22c55e",
					600: "#16a34a",
					700: "#15803d",
					800: "#166534",
					900: "#14532d",
				},
				error: {
					50: "#fef2f2",
					100: "#fee2e2",
					200: "#fecaca",
					300: "#fca5a5",
					400: "#f87171",
					500: "#ef4444",
					600: "#dc2626",
					700: "#b91c1c",
					800: "#991b1b",
					900: "#7f1d1d",
				},
				warning: {
					50: "#fffbeb",
					100: "#fef3c7",
					200: "#fde68a",
					300: "#fcd34d",
					400: "#fbbf24",
					500: "#f59e0b",
					600: "#d97706",
					700: "#b45309",
					800: "#92400e",
					900: "#78350f",
				},
			},

			/* Border radius - uses CSS variable for easy brand customization */
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},

			/* Font family - default Inter, change in layout.tsx */
			fontFamily: {
				sans: ["var(--font-sans)", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [TypographyPlugin, FormPlugin, ContainerQueriesPlugin],
};

export default config;
