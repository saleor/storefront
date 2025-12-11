import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { ProductListDocument } from "@/gql/graphql";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("query");
	const channel = searchParams.get("channel");

	if (!query || query.trim().length < 2) {
		return NextResponse.json({ suggestions: [] });
	}

	if (!channel) {
		return NextResponse.json({ error: "Channel is required" }, { status: 400 });
	}

	try {
		// Use ProductListDocument which is simpler and more reliable
		const { products } = await executeGraphQL(ProductListDocument, {
			variables: {
				first: 20,
				channel: channel,
			},
			revalidate: 60,
			withAuth: false,
		});

		// Filter products client-side by search query
		const searchLower = query.toLowerCase();
		const filteredProducts = products?.edges
			.filter((edge) => 
				edge.node.name.toLowerCase().includes(searchLower) ||
				edge.node.category?.name?.toLowerCase().includes(searchLower)
			)
			.slice(0, 6) || [];

		const suggestions = filteredProducts.map((edge) => ({
			id: edge.node.id,
			name: edge.node.name,
			slug: edge.node.slug,
			category: edge.node.category?.name,
			thumbnail: edge.node.thumbnail?.url,
		}));

		return NextResponse.json({ suggestions });
	} catch (error) {
		console.error("Search suggestions error:", error);
		return NextResponse.json({ suggestions: [], error: String(error) });
	}
}
