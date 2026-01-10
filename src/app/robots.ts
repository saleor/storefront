import { type MetadataRoute } from "next";
import { seoConfig, getBaseUrl } from "@/lib/seo";

/**
 * Robots.txt configuration
 * Uses centralized SEO config from @/lib/seo/config.ts
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [...seoConfig.noIndexPaths],
			},
		],
		sitemap: `${getBaseUrl()}/sitemap.xml`,
	};
}
