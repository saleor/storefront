import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";
import { SearchProductsDocument, OrderDirection, ProductOrderField } from "@/gql/graphql";

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
		const { products } = await executeGraphQL(SearchProductsDocument, {
			variables: {
				search: query,
				channel: channel,
				sortBy: ProductOrderField.Rating,
				sortDirection: OrderDirection.Desc,
				first: 6,
			},
			revalidate: 60,
			withAuth: false,
		});

		const suggestions = products?.edges.map((edge) => ({
			id: edge.node.id,
			name: edge.node.name,
			slug: edge.node.slug,
			category: edge.node.category?.name,
			thumbnail: edge.node.thumbnail?.url,
		})) || [];

		return NextResponse.json({ suggestions });
	} catch (error) {
		console.error("Search suggestions error:", error);
		return NextResponse.json({ suggestions: [] });
	}
}
