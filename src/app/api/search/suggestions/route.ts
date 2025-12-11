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

		// Filter products client-side by search query with fuzzy matching
		const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
		
		const filteredProducts = products?.edges
			.map((edge) => {
				const name = edge.node.name.toLowerCase();
				const category = edge.node.category?.name?.toLowerCase() || "";
				const slug = edge.node.slug.toLowerCase();
				
				// Calculate match score
				let score = 0;
				for (const term of searchTerms) {
					if (name.includes(term)) score += 3;
					if (name.startsWith(term)) score += 2;
					if (category.includes(term)) score += 2;
					if (slug.includes(term)) score += 1;
				}
				
				return { edge, score };
			})
			.filter(({ score }) => score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 6)
			.map(({ edge }) => edge) || [];

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
