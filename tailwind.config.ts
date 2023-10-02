import TypographyPlugin from "@tailwindcss/typography";
import FormPlugin from "@tailwindcss/forms";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	plugins: [TypographyPlugin, FormPlugin],
};

export default config;
