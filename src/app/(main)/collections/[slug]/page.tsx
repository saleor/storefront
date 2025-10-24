import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { Suspense } from "react";
import { ProductListByCollectionDocument } from "@/gql/graphql";
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
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug, channel: DEFAULT_CHANNEL },
		revalidate: 60,
	});

	return {
		title: `${collection?.name || "Collection"} | ${collection?.seoTitle || (await parent).title?.absolute}`,
		description:
			collection?.seoDescription || collection?.description || collection?.seoTitle || collection?.name,
	};
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug, channel: DEFAULT_CHANNEL },
		revalidate: 60,
	});

	if (!collection || !collection.products) {
		notFound();
	}

	const { name, products } = collection;

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			{/* Static: Collection title - prerendered with PPR */}
			<h1 className="pb-8 text-xl font-semibold">{name}</h1>

			{/* Dynamic: Product list - streamed with Suspense */}
			<Suspense fallback={<ProductListSkeleton />}>
				<ProductList products={products.edges.map((e) => e.node)} />
			</Suspense>
		</div>
	);
}
