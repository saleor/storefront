import { notFound } from "next/navigation";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { getPaginatedListVariables } from "@/lib/utils";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import {
	buildSortVariables,
	buildFilterVariables,
	resolveCategorySlugsToIds,
} from "@/ui/components/plp/filter-utils";
import { ProductsPageClient } from "./products-client";

// Cache product list for 5 minutes
export const revalidate = 300;

export const metadata = {
	title: "Products · Saleor Storefront example",
	description: "All products in Saleor Storefront example",
};

type PageProps = {
	params: Promise<{ channel: string }>;
	searchParams: Promise<{
		cursor?: string | string[];
		direction?: string | string[];
		sort?: string;
		price?: string;
		colors?: string;
		sizes?: string;
		categories?: string;
	}>;
};

export default async function Page(props: PageProps) {
	const [params, searchParams] = await Promise.all([props.params, props.searchParams]);

	const paginationVariables = getPaginatedListVariables({ params: searchParams });
	const sortBy = buildSortVariables(searchParams.sort);

	// Parse category slugs from URL and resolve to IDs for server-side filtering
	const categorySlugs = searchParams.categories?.split(",").filter(Boolean) || [];
	const categoryMap = await resolveCategorySlugsToIds(categorySlugs);
	const categoryIds = Array.from(categoryMap.values()).map((c) => c.id);

	const filter = buildFilterVariables({
		priceRange: searchParams.price,
		categoryIds,
	});

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			...paginationVariables,
			channel: params.channel,
			sortBy,
			filter,
		},
		revalidate: 300,
	});

	if (!products) {
		notFound();
	}

	const productCards = products.edges.map((e) => transformToProductCard(e.node, params.channel));

	// Build resolved categories array for the client (for active filter display)
	const resolvedCategories = categorySlugs
		.map((slug) => {
			const cat = categoryMap.get(slug);
			return cat ? { slug, id: cat.id, name: cat.name } : null;
		})
		.filter(Boolean) as { slug: string; id: string; name: string }[];

	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		{ label: "Products", href: `/${params.channel}/products` },
	];

	return (
		<>
			<CategoryHero
				title="All Products"
				description="Discover our full collection of premium products."
				breadcrumbs={breadcrumbs}
			/>
			<ProductsPageClient
				products={productCards}
				pageInfo={products.pageInfo}
				totalCount={products.totalCount ?? productCards.length}
				resolvedCategories={resolvedCategories}
			/>
		</>
	);
}
