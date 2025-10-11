import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				black: "#121212",
				accent: {
					50: "oklch(97.44% 0.009 20)",
					100: "oklch(95.39% 0.015 20)",
					200: "oklch(90.23% 0.040 20)",
					300: "oklch(85.55% 0.065 20)",
					400: "oklch(80.32% 0.085 20)",
					500: "oklch(75.6% 0.105 20)",
					600: "oklch(67.08% 0.125 20)",
					700: "oklch(54.88% 0.115 20)",
					800: "oklch(40.93% 0.085 20)",
					900: "oklch(27.18% 0.055 20)",
					950: "oklch(18.16% 0.025 20)",
				},
				base: {
					50: "hsl(0, 0%, 96%)",
					100: "hsl(0, 0%, 91%)",
					200: "hsl(0, 0%, 82%)",
					300: "hsl(0, 0%, 71%)",
					400: "hsl(0, 0%, 60%)",
					500: "hsl(0, 0%, 52%)",
					600: "hsl(0, 0%, 50%)",
					700: "hsl(0, 0%, 40%)",
					800: "hsl(0, 0%, 34%)",
					900: "hsl(0, 0%, 28%)",
					950: "hsl(0, 0%, 15%)",
				},
			},
			fontFamily: {
				sans: ["var(--font-geometos)", "sans-serif"],
				display: ["var(--font-geometos)", "serif"],
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: "42rem",
						color: "hsl(0, 0%, 96%)",
						a: {
							color: "white",
							"&:hover": {
								color: "oklch(54.88% 0.115 20)",
							},
						},
						strong: {
							color: "white",
							fontWeight: "600",
						},
						code: {
							color: "white",
						},
						"h1, h2, h3, h4, h5, h6": {
							color: "white",
							fontFamily: "Geometos, serif",
							fontWeight: "300",
						},
						hr: {
							borderColor: "hsl(0, 0%, 52%)",
						},
						"ol, ul": {
							color: "hsl(0, 0%, 60%)",
						},
						li: {
							color: "hsl(0, 0%, 60%)",
						},
					},
				},
			},
		},
	},
	plugins: [TypographyPlugin, FormPlugin, ContainerQueriesPlugin],
};

export default config;
