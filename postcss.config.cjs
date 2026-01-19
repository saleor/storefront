module.exports = {
	plugins: {
		// Process @import BEFORE Tailwind - inlines imported CSS
		"postcss-import": {},
		tailwindcss: {},
		autoprefixer: {},
	},
};
