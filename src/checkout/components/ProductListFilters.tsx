import { type ProductRepository } from "@/repositories/product/types";
import { FilterOption } from "@/checkout/components/FilterOption";

type ProductListFiltersProps = { productRepository: ProductRepository };

export const ProductListFilters = async ({ productRepository }: ProductListFiltersProps) => {
	const { filters } = await productRepository.getFilters();

	return (
		<div className={"flex w-48 flex-col gap-4"}>
			{filters.map((filter) => (
				<FilterOption key={filter.slug} {...filter} />
			))}
		</div>
	);
};
