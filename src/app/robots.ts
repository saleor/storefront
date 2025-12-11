import { type MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://luxiormall.com";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/api/", "/checkout", "/_next/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
