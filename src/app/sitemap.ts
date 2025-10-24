import { type MetadataRoute } from "next";
import { executeGraphQL } from "@/lib/graphql";
import { ProductListDocument } from "@/gql/graphql";
import { DEFAULT_CHANNEL } from "@/app/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://example.com";

	// Fetch products
	const { products } = await executeGraphQL(ProductListDocument, {
		variables: { first: 100, channel: DEFAULT_CHANNEL },
		revalidate: 60 * 60 * 24, // 24 hours
		withAuth: false,
		tags: ["sitemap", "products"],
	});

	const productUrls: MetadataRoute.Sitemap = (products?.edges || []).map(({ node }) => ({
		url: `${baseUrl}/products/${node.slug}`,
		lastModified: new Date(),
		changeFrequency: "daily" as const,
		priority: 0.8,
	}));

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/products`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		...productUrls,
	];
}
