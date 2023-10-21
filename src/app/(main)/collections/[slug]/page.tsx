import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { ProductListByCollectionDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	return {
		title: `${collection?.seoTitle || collection?.name || "Collection"} · Saleor Storefront example`,
		description:
			collection?.seoDescription || collection?.description || collection?.seoTitle || collection?.name,
	};
};

export default async function Page({ params }: { params: { slug: string } }) {
	const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	if (!collection || !collection.products) {
		notFound();
	}

	const { name, products } = collection;

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="pb-8 text-3xl font-semibold">{name}</h1>
			<ProductList products={products.edges.map((e) => e.node)} />
		</div>
	);
}
