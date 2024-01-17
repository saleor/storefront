import { notFound } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { type ProductRepository } from "@/repositories/product/types";

type ProductListProps = {
	productRepository: ProductRepository;
};

export const ProductList = async ({ productRepository }: ProductListProps) => {
	const { products } = await productRepository.getAll("");

	if (!products) {
		notFound();
	}

	if (products.length <= 0) {
		return <h1 className="mx-auto pb-8 text-center text-xl font-semibold">Nothing found :(</h1>;
	}

	return (
		<ul
			role="list"
			data-testid="ProductList"
			className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
		>
			{products.map((product, index) => (
				<ProductCard
					key={product.id}
					product={product}
					priority={index < 2}
					loading={index < 3 ? "eager" : "lazy"}
				/>
			))}
		</ul>
	);
};
