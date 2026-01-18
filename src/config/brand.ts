/**
 * Brand Configuration
 *
 * Centralized branding settings for the storefront.
 * Update these values when customizing for a new store.
 *
 * @example
 * ```tsx
 * import { brandConfig } from "@/config/brand";
 *
 * <title>{brandConfig.siteName}</title>
 * <p>© {new Date().getFullYear()} {brandConfig.copyrightHolder}</p>
 * ```
 */

export const brandConfig = {
	/** Site name used in titles, metadata, and headers */
	siteName: "Saleor Store",

	/** Legal entity name for copyright notices */
	copyrightHolder: "Saleor Demo Store",

	/** Organization name for structured data (JSON-LD) */
	organizationName: "Saleor Store",

	/** Default brand name for products without a brand */
	defaultBrand: "Saleor Store",

	/** Tagline/description for the store */
	tagline: "Premium products with exceptional quality. Discover our curated collection.",

	/** Homepage meta description */
	description: "Starter pack for building performant e-commerce experiences with Saleor.",

	/** Logo aria-label for accessibility */
	logoAriaLabel: "Store",

	/** Title template - %s will be replaced with page title */
	titleTemplate: "%s | Saleor Store",

	/** Social media handles */
	social: {
		/** Twitter/X handle (without @) - set to null to disable */
		twitter: null as string | null,
		/** Instagram handle (without @) - set to null to disable */
		instagram: null as string | null,
		/** Facebook page URL - set to null to disable */
		facebook: null as string | null,
	},
} as const;

/**
 * Helper to format page title using brand template.
 */
export function formatPageTitle(title: string): string {
	return brandConfig.titleTemplate.replace("%s", title);
}

/**
 * Get copyright text with specified year.
 * Use CopyrightText component for dynamic year in Server Components.
 */
export function getCopyrightText(year: number = new Date().getFullYear()): string {
	return `© ${year} ${brandConfig.copyrightHolder}. All rights reserved.`;
}
