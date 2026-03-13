/** @type {import('tailwindcss').Config} */
module.exports = {
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
				"skeleton-fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"cart-badge-pop": {
					"0%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.4)" },
					"100%": { transform: "scale(1)" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(24px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
				marquee: {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-50%)" },
				},
				shimmer: {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
				"glow-pulse": {
					"0%, 100%": { opacity: "0.4" },
					"50%": { opacity: "0.8" },
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
				"fade-in": "fade-in 0.8s ease-out 0.2s forwards",
				"fade-in-up": "fade-in-up 0.8s ease-out 0.3s forwards",
				"fade-in-up-delay-1": "fade-in-up 0.8s ease-out 0.5s forwards",
				"fade-in-up-delay-2": "fade-in-up 0.8s ease-out 0.7s forwards",
				marquee: "marquee 25s linear infinite",
				shimmer: "shimmer 3s ease-in-out infinite",
				"glow-pulse": "glow-pulse 3s ease-in-out infinite",
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
