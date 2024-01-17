import { notFound, redirect } from "next/navigation";
import { ProductList } from "@/ui/components/ProductList";
import { ProductListFilters } from "@/checkout/components/ProductListFilters";
import { type FilterOption } from "@/repositories/product/types";
import { repositories } from "@/config";

export const metadata = {
	title: "Search products · Saleor Storefront example",
	description: "Search products in Saleor Storefront example",
};

const productRepository = repositories.searchRepository; // const productRepository = SaleorRepository;

export default async function Page({
	searchParams,
	params,
}: {
	searchParams: Record<string, string | string[] | undefined>;
	params: { channel: string };
}) {
	const cursor = typeof searchParams.cursor === "string" ? searchParams.cursor : null;
	const searchValue = searchParams.query;

	if (!searchValue) {
		notFound();
	}

	if (Array.isArray(searchValue)) {
		const firstValidSearchValue = searchValue.find((v) => v.length > 0);
		if (!firstValidSearchValue) {
			notFound();
		}
		redirect(`/search?${new URLSearchParams({ query: firstValidSearchValue }).toString()}`);
	}

	const selectedFilters = Object.keys(searchParams).reduce<FilterOption[]>((acc, key) => {
		if (key === "query") {
			return acc;
		}

		acc.push({ label: key, value: searchParams[key] as string });

		return acc;
	}, []);

	return (
		<section className="mx-auto max-w-7xl p-8 pb-16">
			<div className={"grid grid-flow-col gap-4"}>
				<ProductListFilters productRepository={productRepository} />
				<ProductList productRepository={productRepository} />
			</div>
			{/*{total > 0 ? (*/}
			{/*	<div>*/}
			{/*		<h1 className="pb-8 text-xl font-semibold">Search results for &quot;{searchValue}&quot;:</h1>*/}
			{/*		<div className={"grid grid-cols-2 gap-12"}>*/}
			{/*			<div>*/}
			{/*				#PAGINATION*/}
			{/*				/!*<Pagination />*!/*/}
			{/*			</div>*/}
			{/*		</div>*/}
			{/*	</div>*/}
			{/*) : (*/}
			{/*	<h2>NO results found</h2>*/}
			{/*)}*/}
		</section>
	);
}
