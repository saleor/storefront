import Link from "next/link";
import Image from "next/image";
import type { SearchProduct } from "@/lib/search";
import { localeConfig } from "@/config/locale";

interface SearchResultsProps {
	products: SearchProduct[];
	channel: string;
}

export function SearchResults({ products, channel }: SearchResultsProps) {
	if (products.length === 0) {
		return null;
	}

	return (
		<ul role="list" className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
			{products.map((product, index) => (
				<li key={product.id}>
					<SearchResultCard product={product} channel={channel} priority={index < 2} />
				</li>
			))}
		</ul>
	);
}

function SearchResultCard({
	product,
	channel,
	priority,
}: {
	product: SearchProduct;
	channel: string;
	priority?: boolean;
}) {
	const formattedPrice = new Intl.NumberFormat(localeConfig.default, {
		style: "currency",
		currency: product.currency,
	}).format(product.price);

	return (
		<Link
			href={`/${channel}/products/${product.slug}`}
			className="group block overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-neutral-800/60 to-neutral-900/80 transition-all duration-300 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20"
		>
			<div className="relative aspect-square overflow-hidden bg-neutral-900">
				{product.thumbnailUrl ? (
					<Image
						src={product.thumbnailUrl}
						alt={product.thumbnailAlt || product.name}
						fill
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						priority={priority}
					/>
				) : (
					<div className="flex h-full items-center justify-center text-neutral-600">No image</div>
				)}
			</div>

			<div className="border-t border-white/[0.05] p-4">
				{product.categoryName && (
					<p className="mb-1 text-xs font-medium text-emerald-400/80">{product.categoryName}</p>
				)}
				<h3 className="font-medium leading-tight text-white transition-colors group-hover:text-emerald-400">
					{product.name}
				</h3>
				<p className="mt-2 font-semibold text-white">{formattedPrice}</p>
			</div>
		</Link>
	);
}
