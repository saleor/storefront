import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	return (
		<li
			data-testid="ProductElement"
			className="transform overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105"
		>
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div className="pb-3/4 relative">
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={512}
							height={512}
							sizes={"512px"}
							priority={priority}
							className="absolute h-full w-full object-cover"
						/>
					)}
				</div>
				<div className="p-4">
					<h3 className="text-lg font-semibold text-neutral-900">{product.name}</h3>
					<p className="mt-1 text-sm text-neutral-500" data-testid="ProductElement_Category">
						{product.category?.name}
					</p>
					<p className="mt-2 text-lg font-medium text-neutral-900" data-testid="ProductElement_PriceRange">
						{formatMoneyRange({
							start: product?.pricing?.priceRange?.start?.gross,
							stop: product?.pricing?.priceRange?.stop?.gross,
						})}
					</p>
				</div>
			</LinkWithChannel>
		</li>
	);
}
