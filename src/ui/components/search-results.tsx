import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import Image from "next/image";
import type { SearchProduct } from "@/lib/search";
import { LCP_IMAGE_PRIORITY_COUNT, PLP_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { localeConfig } from "@/config/locale";

interface SearchResultsProps {
	products: SearchProduct[];
	/** BCP 47 locale for price formatting; defaults to the base locale. */
	locale?: string;
	noImageLabel: string;
}

/**
 * Renders search results from any search provider.
 * Uses the common SearchProduct type for provider independence.
 */
export function SearchResults({ products, locale, noImageLabel }: SearchResultsProps) {
	if (products.length === 0) {
		return null;
	}

	return (
		<ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product, index) => (
				<li key={product.id}>
					<SearchResultCard
						product={product}
						priority={index < LCP_IMAGE_PRIORITY_COUNT}
						locale={locale}
						noImageLabel={noImageLabel}
					/>
				</li>
			))}
		</ul>
	);
}

function SearchResultCard({
	product,
	priority,
	locale = localeConfig.default,
	noImageLabel,
}: {
	product: SearchProduct;
	priority?: boolean;
	locale?: string;
	noImageLabel: string;
}) {
	const formattedPrice = new Intl.NumberFormat(locale, {
		style: "currency",
		currency: product.currency,
	}).format(product.price);

	return (
		<LinkWithChannel
			href={`/products/${product.slug}`}
			className="hover:border-foreground/20 group block overflow-hidden rounded-lg border border-border bg-card transition-colors"
		>
			{/* Image */}
			<div className="relative aspect-square overflow-hidden bg-muted">
				{product.thumbnailUrl ? (
					<Image
						src={product.thumbnailUrl}
						alt={product.thumbnailAlt || product.name}
						fill
						sizes={PLP_IMAGE_SIZES}
						quality={PRODUCT_IMAGE_QUALITY}
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						priority={priority}
						loading={priority ? undefined : "lazy"}
					/>
				) : (
					<div className="flex h-full items-center justify-center text-muted-foreground">{noImageLabel}</div>
				)}
			</div>

			{/* Content */}
			<div className="p-4">
				{product.categoryName && <p className="mb-1 text-xs text-muted-foreground">{product.categoryName}</p>}
				<h3 className="font-medium leading-tight text-foreground group-hover:underline">{product.name}</h3>
				<p className="mt-2 font-semibold text-foreground">{formattedPrice}</p>
			</div>
		</LinkWithChannel>
	);
}
