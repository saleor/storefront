/**
 * Site-wide chrome copy (announcement bar, etc.).
 * Edit here to customize promos without touching layout components.
 */
export const siteChrome = {
	announcementBar: {
		id: "welcome-promo",
		message: "Free shipping on orders over $75",
		href: null as string | null,
		linkLabel: null as string | null,
		dismissible: true,
	},
} as const;
