import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/product-image-wrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { HOMEPAGE_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { formatMoneyRange } from "@/lib/utils";

export function ProductElement({
	product,
	channel,
	priority,
}: {
	product: ProductListItemFragment;
	channel: string;
	priority?: boolean;
}) {
	const href = `/${encodeURIComponent(channel)}/products/${encodeURIComponent(product.slug)}`;

	return (
		<li data-testid="ProductElement">
			<Link href={href} prefetch={false}>
				<div>
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							sizes={HOMEPAGE_IMAGE_SIZES}
							quality={PRODUCT_IMAGE_QUALITY}
							priority={priority}
							loading={priority ? undefined : "lazy"}
						/>
					)}
					<div className="mt-2 flex justify-between">
						<div>
							<h3 className="mt-1 text-sm font-semibold text-neutral-900">{product.name}</h3>
							<p className="mt-1 text-sm text-neutral-500" data-testid="ProductElement_Category">
								{product.category?.name}
							</p>
						</div>
						<p className="mt-1 text-sm font-medium text-neutral-900" data-testid="ProductElement_PriceRange">
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
