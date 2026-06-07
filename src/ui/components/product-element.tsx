import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/product-image-wrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

export function ProductElement({
	product,
	channel,
	loading,
	priority,
}: {
	product: ProductListItemFragment;
	channel: string;
	loading: "eager" | "lazy";
	priority?: boolean;
}) {
	const href = `/${encodeURIComponent(channel)}/products/${encodeURIComponent(product.slug)}`;

	return (
		<li data-testid="ProductElement">
			<Link href={href} prefetch={false}>
				<div>
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={512}
							height={512}
							sizes={"512px"}
							priority={priority}
						/>
					)}
					<div className="mt-2 flex justify-between">
						<div>
							<h3 className="mt-1 text-sm font-semibold text-foreground">{product.name}</h3>
							<p className="mt-1 text-sm text-muted-foreground" data-testid="ProductElement_Category">
								{product.category?.name}
							</p>
						</div>
						<p className="mt-1 text-sm font-medium text-foreground" data-testid="ProductElement_PriceRange">
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
