import TypographyPlugin from "@tailwindcss/typography";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{ts,tsx}"],
	plugins: [TypographyPlugin],
};

export default config;
