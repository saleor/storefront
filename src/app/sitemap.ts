import { type MetadataRoute } from "next";
import { executeGraphQL } from "@/lib/graphql";
import { ProductListDocument } from "@/gql/graphql";

const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://luxiormall.com";
const defaultChannel = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL || "default-channel";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/${defaultChannel}/products`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/${defaultChannel}/cart`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/${defaultChannel}/login`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/${defaultChannel}/wishlist`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
	];

	// Fetch products for dynamic pages
	let productPages: MetadataRoute.Sitemap = [];
	try {
		const { products } = await executeGraphQL(ProductListDocument, {
			variables: {
				first: 100,
				channel: defaultChannel,
			},
			revalidate: 3600,
			withAuth: false,
		});

		if (products?.edges) {
			productPages = products.edges.map(({ node }) => ({
				url: `${baseUrl}/${defaultChannel}/products/${node.slug}`,
				lastModified: new Date(),
				changeFrequency: "weekly" as const,
				priority: 0.8,
			}));
		}
	} catch (error) {
		console.error("Error fetching products for sitemap:", error);
	}

	return [...staticPages, ...productPages];
}
