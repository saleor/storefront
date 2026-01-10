import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";
import AnimatePlugin from "tailwindcss-animate";
import { type Config } from "tailwindcss";

/**
 * Tailwind Configuration
 * Brand tokens defined in src/styles/brand.css
 */
const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
				destructive: {
					DEFAULT: "var(--destructive)",
					foreground: "var(--destructive-foreground)",
				},
				success: {
					DEFAULT: "var(--success)",
					foreground: "var(--success-foreground)",
				},
				border: "var(--border)",
				input: "var(--input)",
				ring: "var(--ring)",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				xl: "calc(var(--radius) + 4px)",
			},
			fontFamily: {
				sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
				mono: ["var(--font-geist-mono)", "monospace"],
			},
			borderColor: {
				DEFAULT: "var(--border)",
			},
			outlineColor: {
				DEFAULT: "var(--ring)",
			},
			ringColor: {
				DEFAULT: "var(--ring)",
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
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"fade-out": {
					from: { opacity: "1" },
					to: { opacity: "0" },
				},
				"slide-in-from-bottom": {
					from: { transform: "translateY(100%)" },
					to: { transform: "translateY(0)" },
				},
				"slide-out-to-bottom": {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(100%)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.2s ease-out",
				"fade-out": "fade-out 0.2s ease-out",
				"slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
				"slide-out-to-bottom": "slide-out-to-bottom 0.3s ease-out",
			},
		},
	},
	plugins: [TypographyPlugin, FormPlugin, ContainerQueriesPlugin, AnimatePlugin],
};

export default config;
