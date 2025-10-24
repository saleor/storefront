import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { Suspense } from "react";
import { ProductListByCategoryDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { ProductListSkeleton } from "@/ui/atoms/SkeletonLoader";
import { DEFAULT_CHANNEL } from "@/app/config";

// ✅ PPR enabled globally via experimental.cacheComponents in next.config.js

export const generateMetadata = async (
	props: { params: Promise<{ slug: string }> },
	parent: ResolvingMetadata,
): Promise<Metadata> => {
	const params = await props.params;
	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug: params.slug, channel: DEFAULT_CHANNEL },
		revalidate: 60,
	});

	return {
		title: `${category?.name || "Categroy"} | ${category?.seoTitle || (await parent).title?.absolute}`,
		description: category?.seoDescription || category?.description || category?.seoTitle || category?.name,
	};
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const { category } = await executeGraphQL(ProductListByCategoryDocument, {
		variables: { slug: params.slug, channel: DEFAULT_CHANNEL },
		revalidate: 60,
	});

	if (!category || !category.products) {
		notFound();
	}

	const { name, products } = category;

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			{/* Static: Category title - prerendered with PPR */}
			<h1 className="pb-8 text-xl font-semibold">{name}</h1>

			{/* Dynamic: Product list - streamed with Suspense */}
			<Suspense fallback={<ProductListSkeleton />}>
				<ProductList products={products.edges.map((e) => e.node)} />
			</Suspense>
		</div>
	);
}
