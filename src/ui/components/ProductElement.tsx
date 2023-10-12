import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/graphql";

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	return (
		<li data-testid="ProductElement">
			<Link href={`/products/${product.slug}`} key={product.id}>
				<div>
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={512}
							height={512}
							priority={priority}
						/>
					)}
					<div className="mt-2 flex justify-between">
						<div>
							<h3 className="text-sm font-semibold text-neutral-700">{product.name}</h3>
							<p className="text-sm text-neutral-500">{product?.category?.name}</p>
						</div>
						<p className="text-sm font-medium text-neutral-900">
							{formatMoneyRange({
								start: product?.pricing?.priceRange?.start?.gross,
								stop: product?.pricing?.priceRange?.stop?.gross,
							})}
						</p>
					</div>
				</div>
			</Link>
		</li>
	);
}
