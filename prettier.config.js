module.exports = {
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 110,
	useTabs: true,
	plugins: [require("prettier-plugin-tailwindcss")],
	tailwindConfig: "./tailwind.config.js",
};