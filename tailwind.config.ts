import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	plugins: [TypographyPlugin, FormPlugin, ContainerQueriesPlugin],
	theme: {
		extend: {
			transitionProperty: { width: "width" },
		},
	},
	variants: {
		stroke: ["hover", "focus"],
	},
};

export default config;
