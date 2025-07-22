import { type NextRequest } from "next/server";
import { ProductSlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { DEFAULT_CHANNEL } from "@/lib/utils";

export async function GET(request: NextRequest) {
	const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL;

	if (!baseUrl) {
		return new Response("Base URL is not configured. Check the .env file", { status: 500 });
	}

	const searchParams = request.nextUrl.searchParams;
	const productId = searchParams.get("productId");

	if (!productId) {
		return new Response("Product ID is required", { status: 400 });
	}

	const { product } = await executeGraphQL(ProductSlugDocument, {
		variables: {
			productId,
			channel: DEFAULT_CHANNEL,
		},
		revalidate: 60,
	});

	const slug = product?.slug;

	if (!slug) {
		return new Response("Product not found", { status: 404 });
	}

	return Response.redirect(new URL(`/${DEFAULT_CHANNEL}/products/${product.slug}`, baseUrl).toString(), 302);
}
