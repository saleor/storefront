import { ProductListPaginatedDocument } from "@/gql/graphql";
import { ProductsPerPage, execute } from "@/lib";
import { Pagination } from "@/ui/components/Pagination";
import { ProductElement } from "@/ui/components/ProductElement";

export const metadata = {
	title: "Product List · Saleor Storefront",
};

type Props = {
	searchParams: {
		page: number;
	};
};

export default async function Page({ searchParams }: Props) {
	const { page } = searchParams;

	const { products } = await execute(ProductListPaginatedDocument, {
		variables: {
			first: ProductsPerPage,
		},
	});

	return (
		<section className="sm:py-18 mx-auto max-w-2xl px-8 py-12 sm:px-6 lg:max-w-7xl">
			<div className="my-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{products?.edges.map(({ node: product }) => <ProductElement key={product.id} product={product} />)}
			</div>
			<Pagination page={Number(page || 1)} total={products?.totalCount || 0} />
		</section>
	);
}
