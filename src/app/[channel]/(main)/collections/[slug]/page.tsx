import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import edjsHTML from "editorjs-html";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { ProductListHeader } from "@/ui/components/ProductListHeader";

const parser = edjsHTML();

// Helper to parse EditorJS JSON description
function parseDescription(description: string | null | undefined): string | null {
	if (!description) return null;
	
	try {
		// Check if it's JSON (EditorJS format)
		const parsed = JSON.parse(description) as { blocks?: Array<{ data?: { text?: string } }> };
		if (parsed.blocks) {
			const html = parser.parse(parsed);
			// Extract text content from HTML for display
			return html.join(" ").replace(/<[^>]*>/g, "").trim();
		}
		return description;
	} catch {
		// Not JSON, return as-is
		return description;
	}
}

export const generateMetadata = async (
	props: { params: Promise<{ slug: string; channel: string }> },
	_parent: ResolvingMetadata,
): Promise<Metadata> => {
	const params = await props.params;
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug, channel: params.channel },
		revalidate: 60,
	});

	const descriptionText = parseDescription(collection?.description);

	return {
		title: `${collection?.name || "Collection"} | Luxior Mall`,
		description: collection?.seoDescription || descriptionText || `Shop ${collection?.name} collection at Luxior Mall.`,
	};
};

export default async function Page(props: { 
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ view?: string; sort?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug, channel: params.channel },
		revalidate: 60,
	});

	if (!collection || !collection.products) {
		notFound();
	}

	const { name, products, description } = collection;
	const productCount = products.edges.length;
	const viewParam = searchParams.view === "list" ? "list" : "grid";
	
	// Parse the description if it's in EditorJS format
	const parsedDescription = parseDescription(description);

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<Breadcrumb 
				items={[
					{ label: "Collections", href: "/products" },
					{ label: name }
				]} 
				className="mb-6"
			/>

			{/* Collection Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-secondary-900">{name}</h1>
				{parsedDescription && (
					<p className="mt-2 text-secondary-600 max-w-3xl">{parsedDescription}</p>
				)}
			</div>

			{/* Product List Header */}
			<ProductListHeader 
				productCount={productCount}
				currentSort={searchParams.sort}
				currentView={viewParam as "grid" | "list"}
			/>

			{/* Product Grid */}
			<h2 className="sr-only">Products in {name}</h2>
			<ProductList 
				products={products.edges.map((e) => e.node)} 
				variant={viewParam as "grid" | "list"}
				columns={4}
			/>

			{/* Empty State */}
			{productCount === 0 && (
				<div className="text-center py-16">
					<p className="text-secondary-600">No products found in this collection.</p>
				</div>
			)}
		</section>
	);
}
