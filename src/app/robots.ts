import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://example.com";

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/checkout", "/cart", "/api/", "/_next/"],
			},
			{
				userAgent: "GPTBot",
				disallow: ["/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
