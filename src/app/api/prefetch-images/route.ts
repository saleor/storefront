import { type NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import {
	ProductDetailsDocument,
	ProductListDocument,
	ProductListByCategoryDocument,
	ProductListByCollectionDocument,
} from "@/gql/graphql";
import { DEFAULT_CHANNEL } from "@/app/config";

/**
 * API endpoint for prefetching images based on route pathname
 * Used by enhanced Link component to prefetch images before navigation
 *
 * Note: This route is automatically dynamic due to searchParams usage.
 * The prerender warnings during build can be safely ignored - they indicate
 * that Next.js correctly detected this route needs dynamic rendering.
 */
export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const pathname = searchParams.get("pathname");

		if (!pathname) {
			return NextResponse.json({ images: [] });
		}

		const images: string[] = [];

		// Extract product slug from pathname
		const productMatch = pathname.match(/\/products\/([^/?]+)/);
		if (productMatch) {
			const slug = decodeURIComponent(productMatch[1]);

			const { product } = await executeGraphQL(ProductDetailsDocument, {
				variables: { slug, channel: DEFAULT_CHANNEL },
				revalidate: 60,
			});

			if (product?.thumbnail?.url) {
				images.push(product.thumbnail.url);
			}

			return NextResponse.json({ images });
		}

		// Extract category slug from pathname
		const categoryMatch = pathname.match(/\/categories\/([^/?]+)/);
		if (categoryMatch) {
			const slug = decodeURIComponent(categoryMatch[1]);

			const { category } = await executeGraphQL(ProductListByCategoryDocument, {
				variables: { slug, channel: DEFAULT_CHANNEL },
				revalidate: 60,
			});

			// Get first few products from category
			category?.products?.edges?.slice(0, 6).forEach((edge) => {
				if (edge?.node?.thumbnail?.url) {
					images.push(edge.node.thumbnail.url);
				}
			});

			return NextResponse.json({ images });
		}

		// Extract collection slug from pathname
		const collectionMatch = pathname.match(/\/collections\/([^/?]+)/);
		if (collectionMatch) {
			const slug = decodeURIComponent(collectionMatch[1]);

			const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
				variables: { slug, channel: DEFAULT_CHANNEL },
				revalidate: 60,
			});

			// Get first few products from collection
			collection?.products?.edges?.slice(0, 6).forEach((edge) => {
				if (edge?.node?.thumbnail?.url) {
					images.push(edge.node.thumbnail.url);
				}
			});

			return NextResponse.json({ images });
		}

		// For product listing pages, prefetch from general product list
		if (pathname.includes("/products")) {
			const { products } = await executeGraphQL(ProductListDocument, {
				variables: { first: 12, channel: DEFAULT_CHANNEL },
				revalidate: 60,
			});

			products?.edges?.forEach((edge) => {
				if (edge?.node?.thumbnail?.url) {
					images.push(edge.node.thumbnail.url);
				}
			});

			return NextResponse.json({ images });
		}

		// Return empty array for unmatched routes
		return NextResponse.json({ images: [] });
	} catch (error) {
		console.error("Error fetching images for prefetch:", error);
		return NextResponse.json({ images: [] });
	}
}
