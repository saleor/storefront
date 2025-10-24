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
		<li data-testid="ProductElement" className="stagger-item">
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div className="card-elevated hover-lift group relative flex h-full flex-col overflow-hidden">
					{product?.thumbnail?.url && (
						<div className="relative overflow-hidden bg-gradient-to-br from-base-900 to-base-950">
							<ProductImageWrapper
								loading={loading}
								src={product.thumbnail.url}
								alt={product.thumbnail.alt ?? ""}
								width={400}
								height={400}
								priority={priority}
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
							/>
							{/* Shimmer effect on hover */}
							<div className="animate-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
						</div>
					)}
					<div className="mt-4 flex flex-1 flex-col justify-between gap-2">
						<div>
							<h3 className="text-base font-medium text-white transition-colors duration-300 group-hover:text-accent-200">
								{product.name}
							</h3>
							<p
								className="mt-1.5 text-sm text-base-300 transition-colors duration-300 group-hover:text-base-200"
								data-testid="ProductElement_Category"
							>
								{product.category?.name}
							</p>
						</div>
						<div className="flex items-center justify-between">
							<p className="gradient-text text-base font-semibold" data-testid="ProductElement_PriceRange">
								{formatMoneyRange({
									start: product?.pricing?.priceRange?.start?.gross,
									stop: product?.pricing?.priceRange?.stop?.gross,
								})}
							</p>
							{/* Animated arrow indicator */}
							<span
								className="translate-x-0 transform text-accent-200 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
								aria-hidden="true"
							>
								→
							</span>
						</div>
					</div>
					{/* Glow effect on hover */}
					<div
						className="rounded-inherit pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						style={{ boxShadow: "0 0 30px rgba(var(--glow-color), 0.15)" }}
					></div>
				</div>
			</LinkWithChannel>
		</li>
	);
}
