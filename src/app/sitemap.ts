import { type MetadataRoute } from "next";
import { executeGraphQL } from "@/lib/graphql";
import { ProductListDocument } from "@/gql/graphql";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://example.com";
	const defaultChannel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel";

	// Fetch products
	const { products } = await executeGraphQL(ProductListDocument, {
		variables: { first: 100, channel: defaultChannel },
		revalidate: 60 * 60 * 24, // 24 hours
		withAuth: false,
		tags: ["sitemap", "products"],
	});

	const productUrls: MetadataRoute.Sitemap = (products?.edges || []).map(({ node }) => ({
		url: `${baseUrl}/${defaultChannel}/products/${node.slug}`,
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
			url: `${baseUrl}/${defaultChannel}/products`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		...productUrls,
	];
}
