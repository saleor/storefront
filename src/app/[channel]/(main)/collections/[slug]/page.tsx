import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { getPaginatedListVariables } from "@/lib/utils";
import { parseEditorJSToText } from "@/lib/editorjs";
import { CategoryHero, transformToProductCard } from "@/ui/components/plp";
import { buildSortVariables, buildFilterVariables } from "@/ui/components/plp/filter-utils";
import { CollectionPageClient } from "./client";

// Cache collection pages for 5 minutes
export const revalidate = 300;

type PageProps = {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{
		cursor?: string;
		direction?: string;
		sort?: string;
		price?: string;
		colors?: string;
		sizes?: string;
	}>;
};

export const generateMetadata = async (props: PageProps, parent: ResolvingMetadata): Promise<Metadata> => {
	const params = await props.params;
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug, channel: params.channel, first: 1 },
		revalidate: 300,
	});

	// Parse EditorJS description for meta tag
	const plainDescription = parseEditorJSToText(collection?.description);

	return {
		title: `${collection?.name || "Collection"} | ${collection?.seoTitle || (await parent).title?.absolute}`,
		description: collection?.seoDescription || plainDescription || collection?.seoTitle || collection?.name,
	};
};

export default async function Page(props: PageProps) {
	const [params, searchParams] = await Promise.all([props.params, props.searchParams]);

	// Build pagination variables
	const paginationVariables = getPaginatedListVariables({ params: searchParams });

	// Build server-side sort and filter variables
	const sortBy = buildSortVariables(searchParams.sort);
	const filter = buildFilterVariables({ priceRange: searchParams.price });

	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: params.slug,
			channel: params.channel,
			...paginationVariables,
			sortBy,
			filter,
		},
		revalidate: 300,
	});

	if (!collection || !collection.products) {
		notFound();
	}

	const { name, description, products, backgroundImage } = collection;

	const productCards = products.edges.map((e) => transformToProductCard(e.node, params.channel));

	// Parse EditorJS description to plain text for hero display
	const plainDescription = parseEditorJSToText(description);

	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		{ label: name, href: `/${params.channel}/collections/${params.slug}` },
	];

	return (
		<>
			<CategoryHero
				title={name}
				description={plainDescription}
				backgroundImage={backgroundImage?.url}
				breadcrumbs={breadcrumbs}
			/>
			<CollectionPageClient
				products={productCards}
				pageInfo={products.pageInfo}
				totalCount={products.totalCount ?? productCards.length}
			/>
		</>
	);
}
