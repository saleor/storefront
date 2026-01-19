/**
 * SEO Configuration
 *
 * Centralized SEO settings for the storefront.
 * Branding values are imported from @/config/brand.
 *
 * To disable SEO features entirely, you can:
 * 1. Remove imports of this module
 * 2. Set individual features to undefined/null
 */

import { brandConfig } from "@/config/brand";
import { localeConfig } from "@/config/locale";

export const seoConfig = {
	/** Site name used in titles and OG tags */
	siteName: brandConfig.siteName,

	/** Default site description */
	description: brandConfig.tagline,

	/** Default locale for OG tags */
	locale: localeConfig.ogLocale,

	/** Twitter/X handle (without @) - set to null to disable */
	twitterHandle: brandConfig.social.twitter,

	/** Organization name for structured data */
	organizationName: brandConfig.organizationName,

	/** Default brand name for products without a brand */
	defaultBrand: brandConfig.defaultBrand,

	/** Title template - %s will be replaced with page title */
	titleTemplate: brandConfig.titleTemplate,

	/** Separator used in compound titles */
	titleSeparator: " | ",

	/** Pages to exclude from search engine indexing */
	noIndexPaths: ["/checkout", "/cart", "/api/", "/login", "/orders"],

	/** Enable/disable JSON-LD structured data */
	enableJsonLd: true,

	/** Enable/disable OpenGraph tags */
	enableOpenGraph: true,

	/** Enable/disable Twitter cards */
	enableTwitterCards: true,
} as const;

/**
 * Get the base URL for the storefront
 * Falls back to localhost for development
 */
export function getBaseUrl(): string {
	return process.env.NEXT_PUBLIC_STOREFRONT_URL || "http://localhost:3000";
}

/**
 * Get the metadata base URL object
 * Used by Next.js for resolving relative URLs in metadata
 */
export function getMetadataBase(): URL {
	return new URL(getBaseUrl());
}
