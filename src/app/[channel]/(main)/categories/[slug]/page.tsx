import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { ProductListHeader } from "@/ui/components/ProductListHeader";

export const generateMetadata = async (
	props: { params: Promise<{ slug: string; channel: string }> },
	_parent: ResolvingMetadata,
): Promise<Metadata> => {
	const params = await props.params;
	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug: params.slug, channel: params.channel },
		revalidate: 60,
	});

	return {
		title: `${category?.name || "Category"} | Luxior Mall`,
		description: category?.seoDescription || category?.description || `Shop ${category?.name} at Luxior Mall. Find the best products and deals.`,
	};
};

export default async function Page(props: { 
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ view?: string; sort?: string }>;
}) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	
	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug: params.slug, channel: params.channel },
		revalidate: 60,
	});

	if (!category || !category.products) {
		notFound();
	}

	const { name, products, description } = category;
	const productCount = products.edges.length;
	const viewParam = searchParams.view === "list" ? "list" : "grid";

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<Breadcrumb 
				items={[
					{ label: "Categories", href: "/products" },
					{ label: name }
				]} 
				className="mb-6"
			/>

			{/* Category Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-secondary-900">{name}</h1>
				{description && (
					<p className="mt-2 text-secondary-600 max-w-3xl">{description}</p>
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
					<p className="text-secondary-600">No products found in this category.</p>
				</div>
			)}
		</section>
	);
}
