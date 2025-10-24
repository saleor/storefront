export const SITE_CONFIG = {
	name: "Sonic Drive Studio",
	description:
		"High-quality cab impulse responses and amp captures for professional guitar tones. Perfect for rock, metal, and all genres.",
	url: process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://sonicdrivestudio.com",
	image: "/og-image.jpg",
	locale: "en_US",
	twitter: {
		site: "@sonicdrivestudio",
		creator: "@sonicdrivestudio",
	},
	social: {
		youtube: "https://www.youtube.com/c/sonicdrivestudio",
		facebook: "https://facebook.com/sonicdrivestudio",
		instagram: "https://www.instagram.com/sonicdrivestudio_official",
	},
	contact: {
		email: "support@sonicdrivestudio.com",
	},
} as const;

export const DEFAULT_SEO = {
	title: SITE_CONFIG.name,
	description: SITE_CONFIG.description,
	image: SITE_CONFIG.image,
	type: "website" as const,
};
